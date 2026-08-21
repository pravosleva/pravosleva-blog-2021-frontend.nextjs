import { AudioPodcastService, IAudioTrack } from './AudioPodcastService'

export class AdvancedAudioPodcastService extends AudioPodcastService {
  // Изолированные свойства Web Audio API для визуализации
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaElementAudioSourceNode | null = null;

  constructor(...args: any[]) {
    // Вызываем конструктор базового AudioPodcastService для инициализации всех сигналов движка
    super(...args);
  }

  /**
   * ПЕРЕОПРЕДЕЛЕНИЕ: Расширяем привязку аудио-элемента логикой Web Audio
   */
  public override registerAudioElement(el: HTMLAudioElement | null): void {
    // 1. Сначала отдаем элемент базовому сервису (он настроит src, CORS и восстановит тайминг)
    super.registerAudioElement(el);
    
    if (el) {
      // 2. Добавляем слушатель для обхода политик Autoplay в браузерах
      el.addEventListener('play', () => {
        this.initAudioContext();
      }, { once: true });
    }
  }

  /**
   * Изолированная инициализация аудио-контекста
   */
  private initAudioContext(): void {
    // Обращаемся к приватному аудио-элементу базового класса через геттер или если он у нас protected.
    // Так как в базовом он private, нам нужно добавить для него простой публичный/protected геттер в базовом классе, 
    // либо получить его из инстанса. Давайте предположим, что мы добавили getNativeAudioEl() в базовый класс.
    const nativeEl = this.getNativeAudioEl();
    if (!nativeEl || this.audioCtx) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256; 
      this.analyser.smoothingTimeConstant = 0.8; 

      this.source = this.audioCtx.createMediaElementSource(nativeEl);
      
      this.source.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
      console.log('🔮 [Advanced Audio Engine]: Web Audio API Context initialized successfully.');
    } catch (e) {
      console.error('Не удалось инициализировать расширенный аудио-контекст:', e);
    }
  }

  /**
   * Публичный метод для Canvas-компонентов
   */
  public getAnalyser(): AnalyserNode | null {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.analyser;
  }
}
