import { AbstractService, Signal } from '@pravosleva/reactive-engine'

export interface IAudioTrack {
  id: string;      // Уникальный ID (URL трека)
  url: string;     // Прямая ссылка на mp3/wav
  title: string;   // Описание/название трека
}

export class AudioPodcastService extends AbstractService {
  // Строгие generic-типы сигналов
  public queue: Signal<IAudioTrack[]>;
  public currentTrack: Signal<IAudioTrack | null>;
  public isPlayerVisible: Signal<boolean>;
  public trackErrors: Signal<Record<string, boolean>>;

  /**
   * Инициализируем примитивы в конструкторе, передавая аргументы в родительский класс base
   */
  constructor(eng: any) {
    // @ts-ignore - Передаем все системные аргументы (например, engine) в конструктор родителя
    super(eng);

    // Безопасно наполняем свойства инстанса сигналами движка сразу при создании
    this.queue = this.engine.signal<IAudioTrack[]>(
      this.loadQueueFromStorage(), 
      'audio:queue'
    );
    this.currentTrack = this.engine.signal<IAudioTrack | null>(
      null, 
      'audio:current-track'
    );
    this.isPlayerVisible = this.engine.signal<boolean>(
      false, 
      'audio:player-ui-visible'
    );
    this.trackErrors = this.engine.signal<Record<string, boolean>>(
      {}, 
      'audio:track-errors'
    );
  }

  private loadQueueFromStorage(): IAudioTrack[] {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('blog_audio_queue');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('🚫 Failed to parse audio queue from localStorage', e);
      return [];
    }
  }

  private saveQueueToStorage(queue: IAudioTrack[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('blog_audio_queue', JSON.stringify(queue));
  }

  /**
   * Бизнес-логика: Добавить трек в очередь
   */
  public addToQueue(track: IAudioTrack): void {
    const currentQueue = [...this.queue.value];
    const isDuplicate = currentQueue.some(t => t.url === track.url);

    if (!isDuplicate) {
      const updatedQueue = [...currentQueue, track];
      this.queue.value = updatedQueue;
      this.saveQueueToStorage(updatedQueue);
    }
    
    this.isPlayerVisible.value = true;
  }

  /**
   * Бизнес-логика: Удалить трек из очереди
   */
  public removeFromQueue(trackId: string): void {
    const updatedQueue = this.queue.value.filter((t: IAudioTrack) => t.id !== trackId);
    this.queue.value = updatedQueue;
    this.saveQueueToStorage(updatedQueue);

    if (this.currentTrack.value?.id === trackId) {
      const currentQueue = this.queue.value;
      this.currentTrack.value = currentQueue.length > 0 ? currentQueue[0] : null;
    }
  }

  /**
   * Бизнес-логика: Начать мгновенное воспроизведение
   */
  public playTrack(track: IAudioTrack): void {
    this.currentTrack.value = track;
    this.isPlayerVisible.value = true;
    
    const errors = { ...this.trackErrors.value };
    delete errors[track.id];
    this.trackErrors.value = errors;
  }

  /**
   * Бизнес-логика: Маркировка битого трека при ошибке сервера
   */
  public markTrackAsBroken(trackId: string): void {
    this.trackErrors.value = {
      ...this.trackErrors.value,
      [trackId]: true
    };
  }
}
