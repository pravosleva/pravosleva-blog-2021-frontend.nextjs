import { AbstractService, Signal } from '@pravosleva/reactive-engine'

export interface IAudioTrack {
  id: string;
  url: string;
  title: string;
}

export class AudioPodcastService extends AbstractService {
  public queue: Signal<IAudioTrack[]>;
  public currentTrack: Signal<IAudioTrack | null>;
  public isPlayerVisible: Signal<boolean>;
  public isPlayerMinimized: Signal<boolean>;
  public trackErrors: Signal<Record<string, boolean>>;
  public isPlaying: Signal<boolean>;
  public currentTime: Signal<number>;
  public duration: Signal<number>;

  private audioEl: HTMLAudioElement | null = null;

  constructor(...args: any[]) {
    // @ts-ignore
    super(...args);

    const initialQueue = this.loadQueueFromStorage();
    this.queue = this.engine.signal<IAudioTrack[]>(initialQueue, 'audio:queue');
    
    // 1. Загружаем последний активный трек из localStorage
    const savedActiveTrack = this.loadActiveTrackFromStorage(initialQueue);
    this.currentTrack = this.engine.signal<IAudioTrack | null>(savedActiveTrack, 'audio:current-track');
    
    // Если трек был сохранен в памяти до перезагрузки, включаем шторку в свернутом режиме
    const hasSavedTrack = !!savedActiveTrack;
    this.isPlayerVisible = this.engine.signal<boolean>(hasSavedTrack, 'audio:player-ui-visible');
    this.isPlayerMinimized = this.engine.signal<boolean>(hasSavedTrack, 'audio:player-ui-minimized');
    
    this.trackErrors = this.engine.signal<Record<string, boolean>>({}, 'audio:track-errors');
    this.isPlaying = this.engine.signal<boolean>(false, 'audio:is-playing');
    
    // ИСПРАВЛЕНО: Безопасное обращение к ID через первый элемент массива initialQueue[0]
    const activeTrackId = savedActiveTrack?.id || (initialQueue[0]?.id || '');
    this.currentTime = this.engine.signal<number>(this.getTrackProgress(activeTrackId), 'audio:current-time');
    this.duration = this.engine.signal<number>(0, 'audio:duration');
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

  private saveQueueToStorage(queue: IAudioTrack[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('blog_audio_queue', JSON.stringify(queue));
  }

  // ИСПРАВЛЕНО: Методы для работы с активным треком в localStorage
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

  private saveActiveTrackToStorage(trackId: string | null): void {
    if (typeof window === 'undefined') return;
    if (trackId) {
      localStorage.setItem('blog_audio_active_track_id', trackId);
    } else {
      localStorage.removeItem('blog_audio_active_track_id');
    }
  }

  /**
   * ИСПРАВЛЕНО: Автопереход на следующий трек с обязательным обнулением прогресса завершившегося!
   */
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
    if (el && !el.src) {
      const track = this.currentTrack.value || (this.queue.value.length > 0 ? this.queue.value[0] : null);
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
    }

    const activeTrack = this.currentTrack.value || (this.queue.value.length > 0 ? this.queue.value[0] : null);
    const isCurrentActive = activeTrack?.id === track.id;

    if (isCurrentActive) {
      if (this.audioEl.paused) {
        this.audioEl.play().then(() => {
          this.isPlaying.value = true;
        }).catch(() => {
          this.isPlaying.value = false;
        });
      } else {
        this.audioEl.pause();
        this.isPlaying.value = false;
      }
    } else {
      this.currentTrack.value = track;
      // ИСПРАВЛЕНО: Сохраняем новый активный трек в localStorage при переключении
      this.saveActiveTrackToStorage(track.id);

      this.isPlayerVisible.value = true;
      this.isPlayerMinimized.value = false;
      this.duration.value = 0; 

      this.audioEl.src = track.url;
      this.audioEl.load();

      const savedTime = this.getTrackProgress(track.id);
      if (savedTime > 0) {
        this.audioEl.currentTime = savedTime;
      }

      this.audioEl.play().then(() => {
        this.isPlaying.value = true;
      }).catch(() => {
        this.isPlaying.value = false;
      });

      const errors = { ...this.trackErrors.value };
      delete errors[track.id];
      this.trackErrors.value = errors;
    }
  }

  public stopTrack(): void {
    if (!this.audioEl) return;
    this.audioEl.pause();
    this.audioEl.currentTime = 0;
    this.isPlaying.value = false;
    this.currentTime.value = 0;
    
    // ИСПРАВЛЕНО: Стираем активный трек при полной остановке
    this.saveActiveTrackToStorage(null);
    this.isPlayerVisible.value = false;

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
      
      // Если это первый трек в пустой очереди — делаем его активным по умолчанию
      if (!this.currentTrack.value) {
        this.currentTrack.value = track;
        this.saveActiveTrackToStorage(track.id);
      }
    }
    this.isPlayerVisible.value = true;
    this.isPlayerMinimized.value = false;
  }

  public removeFromQueue(trackId: string): void {
    const wasPlayingTrack = this.currentTrack.value?.id === trackId || 
      (!this.currentTrack.value && this.queue.value?.[0].id === trackId);

    const updatedQueue = this.queue.value.filter((t: IAudioTrack) => t.id !== trackId);
    this.queue.value = updatedQueue;
    this.saveQueueToStorage(updatedQueue);

    if (wasPlayingTrack) {
      if (updatedQueue.length > 0) {
        const nextTrack = updatedQueue[0];
        this.currentTrack.value = nextTrack;
        // ИСПРАВЛЕНО: Обновляем ID активного трека в хранилище при удалении старого
        this.saveActiveTrackToStorage(nextTrack.id);
        this.isPlaying.value = false;

        if (this.audioEl) {
          this.audioEl.src = nextTrack.url;
          this.audioEl.load();
          this.currentTime.value = this.getTrackProgress(nextTrack.id);
          this.audioEl.currentTime = this.currentTime.value;
        }
      } else {
        this.currentTrack.value = null;
        // ИСПРАВЛЕНО: Очищаем ID активного трека, так как очередь пуста
        this.saveActiveTrackToStorage(null);
        this.isPlaying.value = false;
        this.currentTime.value = 0;
        this.duration.value = 0;
        if (this.audioEl) {
          this.audioEl.src = '';
        }
      }
    }
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`track_progress_${trackId}`);
    }
  }

  public markTrackAsBroken(trackId: string): void {
    this.trackErrors.value = { ...this.trackErrors.value, [trackId]: true };
    this.isPlaying.value = false;
  }

  public getNativeAudioEl(): HTMLAudioElement | null {
    return this.audioEl;
  }
}
