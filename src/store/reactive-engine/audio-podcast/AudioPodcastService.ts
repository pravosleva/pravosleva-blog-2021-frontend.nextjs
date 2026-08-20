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

  private audioEl: HTMLAudioElement | null = null;

  constructor(...args: any[]) {
    // @ts-ignore
    super(...args);

    const initialQueue = this.loadQueueFromStorage();
    this.queue = this.engine.signal<IAudioTrack[]>(initialQueue, 'audio:queue');
    this.currentTrack = this.engine.signal<IAudioTrack | null>(null, 'audio:current-track');
    this.isPlayerVisible = this.engine.signal<boolean>(false, 'audio:player-ui-visible');
    this.isPlayerMinimized = this.engine.signal<boolean>(false, 'audio:player-ui-minimized');
    this.trackErrors = this.engine.signal<Record<string, boolean>>({}, 'audio:track-errors');
    this.isPlaying = this.engine.signal<boolean>(false, 'audio:is-playing');
    
    const firstTrackId = initialQueue[0]?.id || '';
    this.currentTime = this.engine.signal<number>(this.getTrackProgress(firstTrackId), 'audio:current-time');

    // ВСЕ ЭФФЕКТЫ ДВИЖКА (this.engine.effect) ПОЛНОСТЬЮ УДАЛЕНЫ, ЧТОБЫ ИСКЛЮЧИТЬ ЦИКЛЫ И ЗАЕДАНИЯ
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
    // При первой привязке (рефреш страницы) восстанавливаем тайминг
    if (el && !el.src) {
      const track = this.currentTrack.value || (this.queue.value.length > 0 ? this.queue.value[0] : null);
      if (track) {
        el.src = track.url;
        const savedTime = this.getTrackProgress(track.id);
        if (savedTime > 0) el.currentTime = savedTime;
      }
    }
  }

  /**
   * ИМПЕРАТИВНОЕ И ЧИСТОЕ ПЕРЕКЛЮЧЕНИЕ ТРЕКОВ
   */
    public toggleTrack(track: IAudioTrack): void {
    if (!this.audioEl) return;

    // Автоматически добавляем трек в очередь, если пользователь запустил его прямо из текста статьи
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
      this.isPlayerVisible.value = true;
      this.isPlayerMinimized.value = false;

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

  public addToQueue(track: IAudioTrack): void {
    const currentQueue = [...this.queue.value];
    const isDuplicate = currentQueue.some(t => t.id === track.id);

    if (!isDuplicate) {
      const updatedQueue = [...currentQueue, track];
      this.queue.value = updatedQueue;
      this.saveQueueToStorage(updatedQueue);
    }
    
    this.isPlayerVisible.value = true;
    this.isPlayerMinimized.value = false;
  }

  public removeFromQueue(trackId: string): void {
    const updatedQueue = this.queue.value.filter((t: IAudioTrack) => t.id !== trackId);
    this.queue.value = updatedQueue;
    this.saveQueueToStorage(updatedQueue);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`track_progress_${trackId}`);
    }

    if (this.currentTrack.value?.id === trackId) {
      const currentQueue = this.queue.value;
      this.currentTrack.value = currentQueue.length > 0 ? currentQueue[0] : null;
      if (!this.currentTrack.value) {
        this.isPlaying.value = false;
        if (this.audioEl) this.audioEl.src = '';
      }
    }
  }

  public markTrackAsBroken(trackId: string): void {
    this.trackErrors.value = { ...this.trackErrors.value, [trackId]: true };
    this.isPlaying.value = false;
  }
}
