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
  public isPlayerMinimized: Signal<boolean>; // Добавили сигнал сворачивания в мини-плеер
  public trackErrors: Signal<Record<string, boolean>>;

  constructor(...args: any[]) {
    // @ts-ignore
    super(...args);

    this.queue = this.engine.signal<IAudioTrack[]>(this.loadQueueFromStorage(), 'audio:queue');
    this.currentTrack = this.engine.signal<IAudioTrack | null>(null, 'audio:current-track');
    this.isPlayerVisible = this.engine.signal<boolean>(false, 'audio:player-ui-visible');
    
    // По умолчанию плеер развернут, если открывается впервые
    this.isPlayerMinimized = this.engine.signal<boolean>(false, 'audio:player-ui-minimized');
    this.trackErrors = this.engine.signal<Record<string, boolean>>({}, 'audio:track-errors');
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

  // МЕТОДЫ ДЛЯ ТАЙМИНГОВ: Сохранение и чтение прогресса трека
  public saveTrackProgress(trackId: string, currentTime: number): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`track_progress_${trackId}`, currentTime.toString());
  }

  public getTrackProgress(trackId: string): number {
    if (typeof window === 'undefined') return 0;
    const saved = localStorage.getItem(`track_progress_${trackId}`);
    return saved ? parseFloat(saved) : 0;
  }

  public addToQueue(track: IAudioTrack): void {
    const currentQueue = [...this.queue.value];
    const isDuplicate = currentQueue.some(t => t.url === track.url);

    if (!isDuplicate) {
      const updatedQueue = [...currentQueue, track];
      this.queue.value = updatedQueue;
      this.saveQueueToStorage(updatedQueue);
    }
    
    this.isPlayerVisible.value = true;
    this.isPlayerMinimized.value = false; // Принудительно разворачиваем при добавлении нового
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
    }
  }

  public playTrack(track: IAudioTrack): void {
    this.currentTrack.value = track;
    this.isPlayerVisible.value = true;
    this.isPlayerMinimized.value = false;
    
    const errors = { ...this.trackErrors.value };
    delete errors[track.id];
    this.trackErrors.value = errors;
  }

  public markTrackAsBroken(trackId: string): void {
    this.trackErrors.value = { ...this.trackErrors.value, [trackId]: true };
  }
}
