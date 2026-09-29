// 1. Базовые структуры данных
export interface BrowserMetricsPayload {
  url: string;
  title: string;
  referrer: string;
  screenResolution: string;
  userLanguage: string[];
  clientId: string;
}

export interface CustomEventParams {
  action: string;
  params?: Record<string, any>;
  clientId: string;
}

// 2. Типизация входящих событий шины (detail для CustomEvent)
export type AnalyticsEventDetail =
  | { type: 'pageview'; payload: { url: string } }
  | { type: 'event'; payload: { action: string; params?: Record<string, any> } };

// 3. Типизация исходящих сообщений в GA4 Worker
export type GoogleWorkerMessage =
  | { type: 'init'; payload: { gaId: string; gaApiSecret?: string; isDebug: boolean } }
  | { type: 'track_pageview'; payload: BrowserMetricsPayload }
  | { type: 'track_event'; payload: CustomEventParams };

// 4. Типизация исходящих сообщений в Яндекс Worker
export type YandexWorkerMessage =
  | { type: 'init'; payload: { yandexId: number } }
  | { type: 'track_pageview'; payload: BrowserMetricsPayload };

// 5. Расширяем глобальный интерфейс WindowEventMap, чтобы зарегистрировать наше кастомное событие
declare global {
  interface WindowEventMap {
    'blog_analytics_event': CustomEvent<AnalyticsEventDetail>;
  }
}
