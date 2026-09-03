// Вспомогательный хелпер для отправки события через CustomEvent
const dispatchToWorker = (eventType: 'pageview' | 'event', payload: any) => {
  if (typeof window === 'undefined') return;
  
  const customEvent = new CustomEvent('blog_analytics_event', {
    detail: { type: eventType, payload }
  });
  
  window.dispatchEvent(customEvent);
};

// 1. Логирование просмотра страниц (Старая сигнатура сохранена!)
export const pageview = (url: string): void => {
  try {
    // Автоматически берем текущий заголовок вкладки из DOM
    const title = typeof document !== 'undefined' ? document.title : '';
    
    dispatchToWorker('pageview', { url, title });
  } catch (err) {
    console.error('Ошибка отправки pageview в воркер:', err);
  }
};

// 2. Логирование кастомных событий (Оставляем без изменений)
export const event = ({ action, params }: { action: string; params?: any }): void => {
  try {
    dispatchToWorker('event', { action, params: params || {} });
  } catch (err) {
    console.error('Ошибка отправки event в воркер:', err);
  }
};
