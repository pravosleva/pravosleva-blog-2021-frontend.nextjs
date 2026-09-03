import { getTechnicalErrorText } from '~/components/GlobalAudioPlayer/utils/getTechnicalErrorText';
import { AudioPodcastService, IAudioTrack } from './AudioPodcastService'
import { Signal, Computed, withLongPolling } from '@pravosleva/reactive-engine'

export class AdvancedAudioPodcastServiceExperimental extends AudioPodcastService {
  public isLive: Signal<boolean>;

  // Изолированная подсистема Web Audio для статических MP3 подкастов
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaElementAudioSourceNode | null = null;

  // Изолированная подсистема Web Audio строго для Живого Радио (Zero Conflict)
  private radioCtx: AudioContext | null = null;
  private radioAnalyser: AnalyserNode | null = null;
  private radioSource: MediaElementAudioSourceNode | null = null;

  // Физические рантайм-элементы
  private radioEl: HTMLAudioElement | null = null;
  private hlsInstance: any = null;

  public isCurrentTrackLiveStream: Computed<boolean>;

  // ИНФРАСТРУКТУРА АВТО-ВОССТАНОВЛЕНИЯ СЕТИ (Long Polling v2 Options API)
  public recoveryTick = this.engine.signal<number>(0, 'audio:advanced:recovery-tick');
  // Вычисляемый кортеж зависимостей ресурса: опрашиваем, пока есть активный трек и тикают часы
  private recoveryDeps = this.engine.computed<[IAudioTrack | null, number, Record<string, string>]>(() => [
    this.currentTrack.value,
    this.recoveryTick.value,
    this.trackErrors.value,
  ], 'audio:advanced:computed:recovery-deps');

  constructor(...args: any[]) {
    super(...args);
    this.isLive = this.engine.signal<boolean>(false, 'audio:advanced:is-live');
    /* =========================================================================
       АРХИТЕКТУРНОЕ РЕШЕНИЕ: Декларативное вычисляемое свойство (Computed)
       Оно автоматически парсит URL активного трека и возвращает true/false.
       ========================================================================= */
    this.isCurrentTrackLiveStream = this.engine.computed<boolean>(() => {
      const track = this.currentTrack.value;
      if (!track) return false;

      // Наша проверенная снайперская регулярка определения живого эфира
      const isHls = track.url.endsWith('.m3u8');
      const isMp3Live = (track.url.includes('hostingradio') || track.url.endsWith('.aacp')) && !isHls;
      
      return isHls || isMp3Live;
    }, 'audio:advanced:computed:is-current-track-live');

    /* =========================================================================
       ОПТИМИЗАЦИЯ ХОЛОДНОГО СТАРТА: Теперь вместо ручного разбора в конструкторе
       мы просто синхронизируем значение нашего нового computed со старым сигналом isLive
       ========================================================================= */
    if (typeof window !== 'undefined') {
      this.isLive.value = this.isCurrentTrackLiveStream.value;
    }

    /* =========================================================================
      ИСПРАВЛЕНО: Расширяем BroadcastChannel с жесткой привязкой контекста .call()
      ========================================================================= */
    if (typeof window !== 'undefined' && !!this.audioChannel) {
      const baseOnMessage = this.audioChannel.onmessage;

      this.audioChannel.onmessage = (event) => {
        // Вызываем базовый обработчик, принудительно прокидывая оригинальный this (BroadcastChannel)
        if (baseOnMessage) {
          baseOnMessage.call(this.audioChannel as BroadcastChannel, event); // <-- ИСПРАВЛЕНО ЗДЕСЬ!
        }

        const { type } = event.data || {};

        if (type === 'someone_started_playback') {
          if (this.radioEl && !this.radioEl.paused) {
            this.radioEl.pause();
            
            if (this.hlsInstance) {
              this.hlsInstance.destroy();
              this.hlsInstance = null;
            }
            
            this.radioEl.removeAttribute('src');
            this.radioEl.load();
            
            this.isPlaying.value = false;
            this.isBuffering.value = false;
            console.log('🛑 [Advanced Engine]: Радио-стрим принудительно заглушен из соседней вкладки.');
          }
        }
      };
    }
    /* =========================================================================
       ДЕКЛАРАТИВНЫЙ РЕСУРС ЛОНГ-ПОЛЛИНГА СЕТЕВЫХ СБОЕВ
       ========================================================================= */
    this.engine.resource<boolean, [IAudioTrack | null, number, Record<string, string>]>(
      withLongPolling(
        async (deps, abortSignal) => {
          const [currentTrackValue] = deps;
          // const track = this.currentTrack.value;
          // if (!currentTrackValue || currentTrackValue.id !== trackId) return false;
          if (!currentTrackValue) return false

          console.log(`📡 [Авто-восстановление] Проверяем связь с сервером для трека: ${currentTrackValue.title}`);

          try {
            // Делаем легкий HEAD запрос без скачивания аудио-байтов (0 КБ трафика)
            const response = await fetch(currentTrackValue.url, {
              method: 'HEAD',
              signal: abortSignal
            });

            // Если сервер ответил успехом — сеть полностью восстановилась!
            return response.ok || response.status === 206;
          } catch (err) {
            // Если сеть всё ещё лежит или VPN оборвал CORS — прокидываем ошибку дальше в экспоненту декоратора
            if (err instanceof DOMException && err.name === 'AbortError') throw err;
            return false;
          }
        },
        {
          // Декларативно продвигаем тактер вперед для легитимного открытия следующего шага
          onNextTick: () => { this.recoveryTick.value += 1; },
          onError: () => undefined,
          delay: 4000,           // Интервал опроса сервера при поиске сети (4 секунды)
          errorInitialDelay: 3000, 
          errorMaxDelay: 10000
        }
      ),
      this.recoveryDeps,
      {
        name: 'audio:advanced:resource:network-recovery',
        resetDataOnSourceChange: true,
        
        // РУБИЛЬНИК (Заслонка): Ресурс просыпается ТОЛЬКО если текущий трек лежит в ошибке!
        validateBeforeFetch: ([currentTrackValue, _recoveryTickValue, trackErrorsValue]) => {
          // const track = this.currentTrack.value;
          return !!currentTrackValue && !!trackErrorsValue[currentTrackValue?.id] ? true : false // && !!currentTrackVale[track.id];
        },

        // БИЗНЕС-ВАЛИДАЦИЯ УСПЕХА: Вызывается на уровне ядра при успешном fetch
        responseValidate: (isServerOnline) => {
          const track = this.currentTrack.value;
          if (!track) return 'Нет активного трека для восстановления';

          if (isServerOnline === true) {
            // СЕТЬ ВОССТАНОВЛЕНА: Намертво вычищаем ошибку из реактивного стейта!
            const errors = { ...this.trackErrors.value };
            if (errors[track.id]) {
              delete errors[track.id];
              this.trackErrors.value = errors; // Оживляем кнопку в списке треков!
              
              // Переводим плеер обратно в статус ОЖИДАНИЕ (серый бейдж) вместо КРАСНОГО сбоя
              this.isBuffering.value = false;
              this.isPlaying.value = false;

              console.log(`⚡ [Авто-восстановление]: Связь с сервером восстановлена! Ошибка по треку "${track.title}" успешно сброшена.`);
            
              // УМНАЯ РЕАНИМАЦИЯ ЗВУКА: 
              // Пытаемся мягко возобновить подкаст, если это НЕ живое радио 
              // (для радио лучше оставить серую кнопку ожидания ради экономии трафика)
              if (!this.isLive.value) {
                const baseEl = this.getNativeAudioEl();
                if (baseEl) {
                  // Заново инициируем команду load, чтобы подтолкнуть застрявший сетевой буфер
                  baseEl.load(); 
                  
                  // Пробуем запустить, перехватывая любые блокировки Autoplay браузера
                  baseEl.play()
                    .then(() => {
                      this.isPlaying.value = true;
                      console.log('▶️ [Авто-восстановление]: Воспроизведение подкаста успешно продолжено автоматически.');
                    })
                    .catch((autoplayErr) => {
                      // Если браузер заблокировал автоплей — не паникуем, плеер просто останется на паузе готовым к клику
                      console.warn('⚠️ [Авто-восстановление]: Браузер запретил автоматический старт звука:', autoplayErr.message);
                    });
                }
              }
            }
            return true;
          }

          // Если fetch прошел, но сервер вернул bad status — лонг-поллинг продолжается
          return 'Сервер всё ещё недоступен...';
        }
      }
    );
  }

  // Регистрируем базовый элемент подкастов
  public override registerAudioElement(el: HTMLAudioElement | null): void {
    super.registerAudioElement(el); 
    
    if (el) {
      // Инициализируем аудиоконтекст подкастов строго один раз при первом воспроизведении
      el.addEventListener('play', () => {
        if (!this.isLive.value) this.initPodcastAudioContext(el);
      });
    }
  }

  // Асинхронный гибридный менеджер потоков (Абсолютная стабилизация)
  public override async toggleTrack(track: IAudioTrack): Promise<void> {
    const baseEl = this.getNativeAudioEl();
    if (!baseEl) return;

    if (typeof window !== 'undefined' && !this.radioEl) {
      this.initRadioElement();
    }

    const currentQueue = [...this.queue.value];
    const isDuplicate = currentQueue.some(t => t.id === track.id);
    if (!isDuplicate) {
      const updatedQueue = [...currentQueue, track];
      this.queue.value = updatedQueue;
      this.saveQueueToStorage(updatedQueue);
      this.broadcast('queue_updated', updatedQueue);
    }

    const activeTrack = this.currentTrack.value || (this.queue.value.length > 0 ? this.queue.value[0] : null);
    const isCurrentActive = activeTrack?.id === track.id;

    const isHlsTarget = track.url.endsWith('.m3u8');
    const isMp3LiveStream = (track.url.includes('hostingradio') || track.url.endsWith('.aacp')) && !isHlsTarget;
    const isAnyLive = isHlsTarget || isMp3LiveStream;

    if (isCurrentActive) {
      if (isAnyLive && this.radioEl) {
        if (this.radioEl.paused) {
          this.currentTime.value = 0;
          this.duration.value = 0;

          if (isHlsTarget) await this.initHlsStream(this.radioEl, track);
          else this.radioEl.src = `${track.url}?_t=${Date.now()}`;
          
          this.radioEl.play()
            .then(() => { 
              this.isPlaying.value = true; 
              this.broadcast('someone_started_playback'); 
              if (this.radioEl) this.initRadioAudioContext(this.radioEl);
            })
            .catch((err) => { console.warn('Прерван запуск радио потока:', err.message); });
        } else {
          this.radioEl.pause();
          this.isPlaying.value = false;
          if (this.hlsInstance) { this.hlsInstance.destroy(); this.hlsInstance = null; }
          this.radioEl.removeAttribute('src');
          this.radioEl.load();
        }
      } else {
        super.toggleTrack(track);
      }
      return;
    }

    // КЛИКНУЛИ ПО СОВЕРШЕННО ДРУГОМУ ТРЕКУ В СПИСКЕ (СМЕНА ПОТОКОВ)
    this.isBuffering.value = true;
    
    // Мгновенно и безальтернативно тушим флаг прямого эфира.
    // Если новый целевой трек окажется радиостанцией — ветка IF ниже сама 
    // взведет его в true. Если это подкаст — флаг железно останется в false!
    this.isLive.value = false;

    // Мгновенно останавливаем оба физических элемента, исключая наложение звуков
    baseEl.pause();
    if (this.radioEl) {
      this.radioEl.pause();
      this.radioEl.removeAttribute('src');
      this.radioEl.load();
    }
    if (this.hlsInstance) {
      this.hlsInstance.destroy();
      this.hlsInstance = null;
    }

    const errors = { ...this.trackErrors.value };
    delete errors[track.id];
    this.trackErrors.value = errors;

    if (isAnyLive && this.radioEl) {
      // ВЕТКА РАДИО
      this.isLive.value = true; // Взводим обратно строго для радио-потоков

      this.currentTrack.value = track;
      this.saveActiveTrackToStorage(track.id);
      this.broadcast('active_track_changed', track);
      this.isPlayerVisible.value = true;
      this.isPlayerMinimized.value = false;
      this.currentTime.value = 0;
      this.duration.value = 0;

      if (isHlsTarget) {
        await this.initHlsStream(this.radioEl, track);
      } else {
        this.radioEl.src = `${track.url}?_t=${Date.now()}`;
        this.radioEl.load();
      }

      this.radioEl.play()
        .then(() => {
          this.isPlaying.value = true;
          this.broadcast('someone_started_playback');
          if (this.radioEl) this.initRadioAudioContext(this.radioEl);
        })
        .catch((err) => { console.warn('Запуск радио перехвачен микротаской:', err.message); });

    } else {
      // ВЕТКА ПОДКАСТОВ: Идеальное бесконфликтное переключение
      // Флаг isLive уже сброшен в false

      // Подставляем фейковый ID для сброса гонки в базовом классе супер-сервиса
      this.currentTrack.value = { id: 'fake_race_condition_fix_id', url: '', title: '' };

      // Полностью передаем управление базовому классу
      super.toggleTrack(track);
    }
  }

  private initRadioElement(): void {
    if (typeof window === 'undefined') return;
    const el = document.createElement('audio');
    el.style.display = 'none';
    el.preload = 'none';
    el.crossOrigin = 'anonymous'; // CORS доступен благодаря Варианту 2 Nginx

    // ДЛЯ ХОЛОДНОГО СТАРТА: Нативные слушатели радио-элемента теперь 
    // напрямую управляют сигналом isPlaying и исцеляют холодный старт бейджа!
    el.addEventListener('waiting', () => { if (this.isLive.value) this.isBuffering.value = true; });
    
    el.addEventListener('playing', () => { 
      if (this.isLive.value) {
        this.isBuffering.value = false;
        this.isPlaying.value = true; // ГАРАНТИЯ СТАРТА ЗЕЛЕНОГО БЕЙДЖА
      }
    });

    el.addEventListener('pause', () => { 
      if (this.isLive.value) {
        this.isBuffering.value = false;
        this.isPlaying.value = false; // ГАРАНТИЯ ТУШЕНИЯ БЕЙДЖА ПРИ ПАУЗЕ
      }
    });

    el.addEventListener('canplay', () => { if (this.isLive.value) this.isBuffering.value = false; });

    el.addEventListener('error', () => {
      if (!this.isLive.value || !this.currentTrack.value) return;
      this.isBuffering.value = false;
      this.isPlaying.value = false;
      const detailedMessage = getTechnicalErrorText(el.error, this.currentTrack.value);
      this.markTrackAsBroken(this.currentTrack.value.id, detailedMessage);
    });

    document.body.appendChild(el);
    this.radioEl = el;
    console.log('📻 [Advanced Audio Engine]: Изолированный Radio Runtime синхронизирован с реактивным UI.');
  }

  public override stopTrack(): void {
    if (this.hlsInstance) { this.hlsInstance.destroy(); this.hlsInstance = null; }
    if (this.radioEl) {
      this.radioEl.pause();
      this.radioEl.removeAttribute('src');
      this.radioEl.load();
    }
    this.isLive.value = false;
    super.stopTrack();
  }

  private initHlsStream(el: HTMLAudioElement, track: IAudioTrack): Promise<void> {
    return import('hls.js').then(({ default: Hls }) => {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          manifestLoadingTimeOut: 15000,
          maxBufferLength: 10,
          maxMaxBufferLength: 20,
          liveSyncDuration: 6,
          liveMaxLatencyDuration: 12
        });
        el.removeAttribute('src');
        hls.loadSource(track.url);
        hls.attachMedia(el);
        this.hlsInstance = hls;

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (!this.currentTrack.value) return;
          if (data.fatal) {
            this.markTrackAsBroken(this.currentTrack.value.id, `[HLS Failure]: ${data.details}`);
            hls.destroy();
            if (this.hlsInstance === hls) this.hlsInstance = null;
          }
        });
      } else if (el.canPlayType('application/vnd.apple.mpegurl')) {
        el.src = track.url;
        el.load();
      }
    });
  }

  // Изолированный контекст А: Строго для базового элемента подкастов (Вызывается ровно один раз)
  private initPodcastAudioContext(nativeEl: HTMLAudioElement): void {
    if (this.audioCtx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;

      this.source = this.audioCtx.createMediaElementSource(nativeEl);
      this.source.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
      console.log('🔮 [Audio Context А]: Успешно привязан к подкастам.');
    } catch (e) {
      console.error('Не удалось запустить аудио-контекст подкастов:', e);
    }
  }

  // Изолированный контекст Б: Строго для радио-элемента radioEl (Вызывается ровно один раз)
  private initRadioAudioContext(radioEl: HTMLAudioElement): void {
    if (this.radioCtx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.radioCtx = new AudioContextClass();
      this.radioAnalyser = this.radioCtx.createAnalyser();
      this.radioAnalyser.fftSize = 256;
      this.radioAnalyser.smoothingTimeConstant = 0.8;

      this.radioSource = this.radioCtx.createMediaElementSource(radioEl);
      this.radioSource.connect(this.radioAnalyser);
      this.radioAnalyser.connect(this.radioCtx.destination);
      console.log('📻 [Audio Context Б]: Успешно привязан к интернет-радио.');
    } catch (e) {
      console.error('Не удалось запустить аудио-контекст радио вещания:', e);
    }
  }

  // Полиморфный геттер для Canvas-компонента.
  // Отдает нужный AnalyserNode на лету в зависимости от того, что сейчас играет.
  public getAnalyser(): AnalyserNode | null {
    if (this.isLive.value) {
      if (this.radioCtx && this.radioCtx.state === 'suspended')
        this.radioCtx.resume();
      return this.radioAnalyser;
    } else {
      if (this.audioCtx && this.audioCtx.state === 'suspended')
        this.audioCtx.resume();
      return this.analyser;
    }
  }
}