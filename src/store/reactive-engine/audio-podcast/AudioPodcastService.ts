import { AbstractService, Signal } from '@pravosleva/reactive-engine'
import { getTechnicalErrorText } from '~/components/GlobalAudioPlayer/utils/getTechnicalErrorText';

export interface IAudioTrack {
  id: string;
  url: string;
  title: string;
}

// const NEXT_APP_GIT_SHA1 = process.env.NEXT_APP_GIT_SHA1 || 'no'
// const getFreshUrl = (url: string) => `${url}?gitSHA1=${NEXT_APP_GIT_SHA1}`

type TAudioTrackErrorText = string;
type TAudioTrackId = string;
export class AudioPodcastService extends AbstractService {
  public queue: Signal<IAudioTrack[]>;
  public currentTrack: Signal<IAudioTrack | null>;
  public isPlayerVisible: Signal<boolean>;
  public isPlayerMinimized: Signal<boolean>;
  public trackErrors: Signal<Record<TAudioTrackId, TAudioTrackErrorText>>;
  public isPlaying: Signal<boolean>;
  public currentTime: Signal<number>;
  public duration: Signal<number>;
  private audioEl: HTMLAudioElement | null = null;
  public playbackRate: Signal<number>;
  private audioChannel: BroadcastChannel | null = null;
  public isBuffering: Signal<boolean>;

  constructor(...args: any[]) {
    // @ts-ignore
    super(...args);

    const initialQueue = this.loadQueueFromStorage();
    this.queue = this.engine.signal<IAudioTrack[]>(initialQueue, 'audio:queue');

    this.isBuffering = this.engine.signal<boolean>(false, 'audio:is-buffering');
    
    // 1. Загружаем последний активный трек из localStorage
    const savedActiveTrack = this.loadActiveTrackFromStorage(initialQueue);
    this.currentTrack = this.engine.signal<IAudioTrack | null>(savedActiveTrack, 'audio:current-track');
    
    // Если трек был сохранен в памяти до перезагрузки, включаем шторку в свернутом режиме
    const hasSavedTrack = !!savedActiveTrack;
    this.isPlayerVisible = this.engine.signal<boolean>(hasSavedTrack, 'audio:player-ui-visible');
    this.isPlayerMinimized = this.engine.signal<boolean>(hasSavedTrack, 'audio:player-ui-minimized');
    
    this.trackErrors = this.engine.signal<Record<TAudioTrackId, TAudioTrackErrorText>>({}, 'audio:track-errors');
    this.isPlaying = this.engine.signal<boolean>(false, 'audio:is-playing');
    
    // ИСПРАВЛЕНО: Безопасное обращение к ID через первый элемент массива initialQueue[0]
    const activeTrackId = savedActiveTrack?.id || (initialQueue[0]?.id || '');
    this.currentTime = this.engine.signal<number>(this.getTrackProgress(activeTrackId), 'audio:current-time');
    this.duration = this.engine.signal<number>(0, 'audio:duration');

    const savedRate = typeof window !== 'undefined' ? localStorage.getItem('blog_audio_playback_rate') : null;
    this.playbackRate = this.engine.signal<number>(savedRate ? parseFloat(savedRate) : 1.0, 'audio:playback-rate');

    // -- MULTITABS_EXP: Внутри constructor инициализируйте канал и подписку на него:
    if (typeof window !== 'undefined') {
      this.audioChannel = new BroadcastChannel('blog_podcast_channel');
      
      this.audioChannel.onmessage = (event) => {
        const { type, payload } = event.data || {};

        switch (type) {
          case 'someone_started_playback':
            // Если в другой вкладке нажали Play — ставим у себя паузу
            if (this.audioEl && !this.audioEl.paused) {
              this.audioEl.pause();
              this.isPlaying.value = false;
              console.log('🛑 Аудио поставлено на паузу, так как подкаст запустили в другой вкладке.');
            }
            break;

          case 'queue_updated':
            // ИСПРАВЛЕНО: Синхронизируем очередь в ОЗУ без лишнего чтения localStorage
            if (payload && Array.isArray(payload)) {
              this.queue.value = payload;
            }
            break;

          case 'active_track_changed':
            if (payload) {
              this.currentTrack.value = payload;
              this.isPlayerVisible.value = true;
              this.currentTime.value = this.getTrackProgress(payload.id);
              if (this.audioEl) {
                this.audioEl.src = payload.url;
                this.audioEl.load();
                this.audioEl.currentTime = this.currentTime.value;
              }
            } else {
              this.currentTrack.value = null;
              this.isPlayerVisible.value = false;
              this.isPlaying.value = false;
              this.currentTime.value = 0;
              /* =========================================================================
                ИСПРАВЛЕНО: Безопасное нативное размонтирование аудио-потока в табах
                ========================================================================= */
              if (this.audioEl) {
                this.audioEl.removeAttribute('src');
                this.audioEl.load();
              }
            }
            break;
        }
      };
    }
    // --
  }

  private loadQueueFromStorage(): IAudioTrack[] {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('blog_audio_queue');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  public saveQueueToStorage(queue: IAudioTrack[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('blog_audio_queue', JSON.stringify(queue));
  }

  private loadActiveTrackFromStorage(currentQueue: IAudioTrack[]): IAudioTrack | null {
    if (typeof window === 'undefined') return null;
    try {
      const savedId = localStorage.getItem('blog_audio_active_track_id');
      // ИСПРАВЛЕНО: Обращаемся к [0] элементу массива, а не к самому массиву
      if (!savedId) return currentQueue.length > 0 ? currentQueue[0] : null; 
      
      const track = currentQueue.find(t => t.id === savedId);
      return track || (currentQueue.length > 0 ? currentQueue[0] : null);
    } catch (e) {
      return null;
    }
  }

  protected saveActiveTrackToStorage(trackId: string | null): void {
    if (typeof window === 'undefined') return;
    if (trackId) {
      localStorage.setItem('blog_audio_active_track_id', trackId);
    } else {
      localStorage.removeItem('blog_audio_active_track_id');
    }
  }

  // Автопереход на следующий трек с обязательным обнулением прогресса завершившегося!
  public playNextTrack(): void {
    if (!this.audioEl) return;

    const currentQueue = this.queue.value;
    if (currentQueue.length === 0) return;

    // 1. Находим текущий активный трек, который ТОЛЬКО ЧТО ДОИГРАЛ
    const activeTrack = this.currentTrack.value || currentQueue[0];
    
    // КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Так как трек успешно завершился, обнуляем его прогресс в localStorage и стейте,
    // чтобы при следующем клике на него он включился с самого начала (0:00), а не с конца!
    if (activeTrack) {
      this.saveTrackProgress(activeTrack.id, 0);
    }

    const currentIndex = currentQueue.findIndex(t => t.id === activeTrack.id);

    // 2. Проверяем, есть ли следующий трек в массиве
    const nextIndex = currentIndex + 1;

    if (nextIndex < currentQueue.length) {
      // Следующий трек существует — запускаем его
      const nextTrack = currentQueue[nextIndex];
      
      // Сбрасываем стейт, чтобы гарантированно отработала чистая загрузка нового URL в toggleTrack
      this.currentTrack.value = null; 
      
      // Включаем воспроизведение следующего подкаста
      this.toggleTrack(nextTrack);
      console.log(`⏭️ Автопереход: Трек "${activeTrack.title}" завершен. Запущен следующий: "${nextTrack.title}"`);
    } else {
      // Очередь закончилась — полностью останавливаем плеер и очищаем UI
      this.stopTrack();
      console.log('🏁 Автопереход: Очередь подкастов полностью прослушана. Воспроизведение остановлено.');
    }
  }

  public saveTrackProgress(trackId: string, currentTime: number): void {
    if (typeof window === 'undefined' || !trackId) return;
    localStorage.setItem(`track_progress_${trackId}`, currentTime.toString());
    this.currentTime.value = currentTime;
  }

  public getTrackProgress(trackId: string): number {
    if (typeof window === 'undefined' || !trackId) return 0;
    const saved = localStorage.getItem(`track_progress_${trackId}`);
    return saved ? parseFloat(saved) : 0;
  }

  public registerAudioElement(el: HTMLAudioElement | null): void {
    this.audioEl = el;
    
    if (el && !el.dataset.initialized) {
      // Помечаем элемент, чтобы слушатели никогда не навешивались повторно
      el.dataset.initialized = 'true';
      
      el.defaultPlaybackRate = this.playbackRate.value;
      el.playbackRate = this.playbackRate.value;

      // -- Системные слушатели буферизации сети:
      // Слушатели буферизации медиа-потока (Защита от зависания UI)
      // Браузер ждет байты из сети — включаем лоадер
      el.addEventListener('waiting', () => { this.isBuffering.value = true; });
      // Звук пошел, или трек снят с паузы — выключаем лоадер
      el.addEventListener('playing', () => { this.isBuffering.value = false; });
      // Если пользователь нажал паузу вручную — лоадер точно не нужен
      el.addEventListener('pause', () => { this.isBuffering.value = false; });
      // Метаданные загрузились — сбрасываем, если трек готов
      el.addEventListener('canplay', () => { this.isBuffering.value = false; });
      // --

      el.addEventListener('loadedmetadata', () => {
        if (!this.audioEl) return;
        this.audioEl.playbackRate = this.playbackRate.value;
      });

      const track = this.currentTrack.value || (this.queue.value.length > 0 ? this.queue.value[0] : null);

      el.addEventListener('error', async () => {
        if (!this.currentTrack.value) return;
        const track = this.currentTrack.value;
        
        let detailedMessage = getTechnicalErrorText(el.error, track);

        // Если браузер выдал размытый код 4, делаем точечный сетевой прострел
        if (el.error?.code === 4) {
          try {
            const response = await fetch(track.url, { method: 'HEAD' });
            if (response.status === 404) {
              detailedMessage = `[404 Not Found] Файл подкаста полностью отсутствует на сервере по адресу: ${track.url}`;
            }
          } catch (netErr) {
            // Если fetch упал на чужом домене — это 100% железная CORS блокировка сети
            detailedMessage = `[CORS Блокировка] Сторонний сервер отклонил запрос. Отсутствует заголовок Access-Control-Allow-Origin для домена ${window.location.host}`;
          }
        }

        this.markTrackAsBroken(track.id, detailedMessage);
      });

      if (track) {
        el.src = track.url;
        const savedTime = this.getTrackProgress(track.id);
        if (savedTime > 0) el.currentTime = savedTime;
      }
    }
  }

  public toggleTrack(track: IAudioTrack): void {
    if (!this.audioEl) return;

    const currentQueue = [...this.queue.value];
    const isDuplicate = currentQueue.some(t => t.id === track.id);
    if (!isDuplicate) {
      const updatedQueue = [...currentQueue, track];
      this.queue.value = updatedQueue;
      this.saveQueueToStorage(updatedQueue);

      // Мгновенно обновляем массив очереди во всех параллельных вкладках
      this.broadcast('queue_updated', updatedQueue);
    }

    const activeTrack = this.currentTrack.value || (this.queue.value.length > 0 ? this.queue.value[0] : null);
    const isCurrentActive = activeTrack?.id === track.id;

    if (isCurrentActive) {
      if (this.audioEl.paused) {
        this.audioEl.play().then(() => {
          this.isPlaying.value = true;
          this.broadcast('someone_started_playback'); // Глушим другие вкладки при возобновлении
        }).catch(() => {
          this.isPlaying.value = false;
        });
      } else {
        this.audioEl.pause();
        this.isPlaying.value = false;
      }
    } else {
      // Чистое переключение на совершенно другой трек подкаста
      this.currentTrack.value = track;
      this.saveActiveTrackToStorage(track.id);
      
      // Оповещаем другие вкладки о смене активного трека
      this.broadcast('active_track_changed', track);

      this.isPlayerVisible.value = true;
      this.isPlayerMinimized.value = false;
      this.duration.value = 0;

      // Мгновенное включение индикатора буферизации
      this.isBuffering.value = true; 

      // Упреждающая очистка ошибок до физического старта воспроизведения
      const errors = { ...this.trackErrors.value };
      delete errors[track.id];
      this.trackErrors.value = errors; 

      // Возвращаемся к стандартному, стабильному нативному HTML5 аудио-потоку
      this.audioEl.src = track.url;
      this.audioEl.load();

      const savedTime = this.getTrackProgress(track.id);
      if (savedTime > 0) {
        this.audioEl.currentTime = savedTime;
      }

      this.audioEl.play().then(() => {
        this.isPlaying.value = true;
        this.broadcast('someone_started_playback'); // Глушим другие вкладки при старте нового трека
      }).catch(() => {
        this.isPlaying.value = false;
        this.isBuffering.value = false; // Страховка: тушим лоадер, если промис play отклонен
      });
    }
  }

  public stopTrack(): void {
    if (!this.audioEl) return;

    this.isBuffering.value = false;

    this.audioEl.pause();
    this.audioEl.currentTime = 0;
    this.isPlaying.value = false;
    this.currentTime.value = 0;
    
    // Стираем активный трек при полной остановке
    this.saveActiveTrackToStorage(null);
    this.isPlayerVisible.value = false;
    this.broadcast('active_track_changed', null); // Говорим всем закрыть плееры

    const activeTrack = this.currentTrack.value || (this.queue.value.length > 0 ? this.queue.value[0] : null);
    if (activeTrack) {
      this.saveTrackProgress(activeTrack.id, 0);
    }
  }

  public addToQueue(track: IAudioTrack): void {
    const currentQueue = [...this.queue.value];
    const isDuplicate = currentQueue.some(t => t.id === track.id);
    if (!isDuplicate) {
      const updatedQueue = [...currentQueue, track];
      this.queue.value = updatedQueue;
      this.saveQueueToStorage(updatedQueue);
      this.broadcast('queue_updated', updatedQueue); // Синхронизируем очередь
      // Если это первый трек в пустой очереди — делаем его активным по умолчанию
      if (!this.currentTrack.value) {
        this.currentTrack.value = track;
        this.saveActiveTrackToStorage(track.id);
        this.broadcast('active_track_changed', track); // Синхронизируем первый трек
      }
    }
    this.isPlayerVisible.value = true;
    this.isPlayerMinimized.value = false;
  }

  public removeFromQueue(trackId: string): void {
    const wasPlayingTrack = this.currentTrack.value?.id === trackId || 
      (!this.currentTrack.value && this.queue.value?.[0]?.id === trackId);

    const updatedQueue = this.queue.value.filter((t: IAudioTrack) => t.id !== trackId);
    this.queue.value = updatedQueue;
    this.saveQueueToStorage(updatedQueue);
    this.broadcast('queue_updated', updatedQueue);

    if (wasPlayingTrack) {
      if (updatedQueue.length > 0) {
        const nextTrack = updatedQueue[0];
        this.currentTrack.value = nextTrack;
        this.saveActiveTrackToStorage(nextTrack.id);
        this.broadcast('active_track_changed', nextTrack);
        this.isPlaying.value = false;

        if (this.audioEl) {
          // Здесь мы просто меняем src на новый.
          this.audioEl.src = nextTrack.url;
          this.audioEl.load();
          this.currentTime.value = this.getTrackProgress(nextTrack.id);
          this.audioEl.currentTime = this.currentTime.value;
        }
      } else {
        this.currentTrack.value = null;
        this.saveActiveTrackToStorage(null);
        this.broadcast('active_track_changed', null);
        this.isPlaying.value = false;
        this.currentTime.value = 0;
        this.duration.value = 0;
        
        // Безопасное стирание ресурсов при пустой очереди ( DRY + No Error )
        if (this.audioEl) {
          this.audioEl.removeAttribute('src');
          this.audioEl.load();
        }
      }
    }
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`track_progress_${trackId}`);
    }

    // Принудительно вычищаем ошибки удаленного трека из реактивного стейта
    const errors = { ...this.trackErrors.value };
    if (errors[trackId]) {
      delete errors[trackId];
      this.trackErrors.value = errors;
    }
  }

  public markTrackAsBroken(trackId: string, technicalReason: string): void {
    this.trackErrors.value = { 
      ...this.trackErrors.value, 
      [trackId]: technicalReason || 'Unknown Media Error' 
    };
    this.isPlaying.value = false;
    
    console.error(`🚨 [Audio Engine] Трек ${trackId} заблокирован. Причина: ${technicalReason}`);
  }

  public getNativeAudioEl(): HTMLAudioElement | null {
    return this.audioEl;
  }

  /**
   * Метод относительной перемотки трека (вперед/назад на N секунд)
   * @param seconds Количество секунд (положительное для вперед, отрицательное для назад)
   */
  public seekRelative(seconds: number): void {
    if (!this.audioEl || !this.currentTrack.value) return;

    const duration = this.audioEl.duration || this.duration.value;
    if (!duration) return;

    // Вычисляем новое время с ограничением от 0 до конца трека
    let newTime = this.audioEl.currentTime + seconds;
    if (newTime < 0) newTime = 0;
    if (newTime > duration) newTime = duration;

    // Применяем нативное изменение времени
    this.audioEl.currentTime = newTime;
    this.currentTime.value = newTime;

    // Сразу сохраняем прогресс, чтобы не ждать планового обновления
    this.saveTrackProgress(this.currentTrack.value.id, newTime);
    console.log(`⏩ Перемотка: смещение на ${seconds}с. Новое время: ${newTime.toFixed(1)}с.`);
  }

  /**
   * Изменение скорости воспроизведения по кругу: 1.0 -> 1.25 -> 1.5 -> 2.0 -> 1.0
   */
  public togglePlaybackRate(): void {
    const rates = [1.0, 1.25, 1.5, 2.0];
    const currentIndex = rates.indexOf(this.playbackRate.value);
    const nextIndex = (currentIndex + 1) % rates.length;
    const nextRate = rates[nextIndex];

    this.playbackRate.value = nextRate;
    if (typeof window !== 'undefined') {
      localStorage.setItem('blog_audio_playback_rate', nextRate.toString());
    }

    if (this.audioEl) {
      this.audioEl.playbackRate = nextRate;
    }
    console.log(`⏱️ Скорость воспроизведения изменена на: x${nextRate}`);
  }

  /**
   * Прямая установка конкретной скорости воспроизведения
   */
  public setPlaybackRate(rate: number): void {
    if (this.playbackRate.value === rate) return;

    this.playbackRate.value = rate;
    if (typeof window !== 'undefined') {
      localStorage.setItem('blog_audio_playback_rate', rate.toString());
    }

    if (this.audioEl) {
      this.audioEl.playbackRate = rate;
    }
    console.log(`⏱️ Скорость принудительно изменена на: x${rate}`);
  }

  // 2. Создадим приватный хелпер для отправки событий в эфир:
  protected broadcast(type: string, payload?: any): void {
    if (this.audioChannel) {
      this.audioChannel.postMessage({ type, payload });
    }
  }

  /**
   * Публичный метод для глушения аудио-плеера извне (например, из видеоплеера)
   */
  public pauseForExternalMedia(): void {
    // 1. Ставим на паузу локальный плеер в текущей вкладке
    if (this.audioEl && !this.audioEl.paused) {
      this.audioEl.pause();
      this.isPlaying.value = false;
    }
    
    // 2. Отправляем сигнал в BroadcastChannel, чтобы заглушить подкасты в соседних вкладках
    this.broadcast('someone_started_playback');
    console.log('🔇 [Audio Engine]: Подкаст приостановлен из-за запуска внешнего видео.');
  }
}
