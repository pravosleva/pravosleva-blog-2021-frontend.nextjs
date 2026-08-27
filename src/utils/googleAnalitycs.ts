// src/utils/googleAnalitycs.ts
// import { metrics } from '~/constants/metrics'

// Вспомогательный хелпер для отправки события через CustomEvent
const dispatchToWorker = (eventType: 'pageview' | 'event', payload: any) => {
  if (typeof window === 'undefined') return;
  
  const customEvent = new CustomEvent('blog_analytics_event', {
    detail: { type: eventType, payload }
  });
  
  window.dispatchEvent(customEvent);
};

// 1. Логирование просмотра страниц (Оставляем старую сигнатуру!)
export const pageview = (url: string): void => {
  try {
    dispatchToWorker('pageview', { url });
  } catch (err) {
    console.error('Ошибка отправки pageview в воркер:', err);
  }
};

// 2. Логирование кастомных событий (Оставляем старую сигнатуру!)
export const event = ({ action, params }: { action: string; params?: any }): void => {
  try {
    dispatchToWorker('event', { action, params: params || {} });
  } catch (err) {
    console.error('Ошибка отправки event в воркер:', err);
  }
};
