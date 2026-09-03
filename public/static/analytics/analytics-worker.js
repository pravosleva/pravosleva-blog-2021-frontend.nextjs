let currentGaId = null;
// ⚠️ Для GA4 Measurement Protocol ОГОВОРКА: строго необходим api_secret.
// Получить его нужно в админке GA4 (Потоки данных -> Твой поток -> Секретные ключи Measurement Protocol)
let gaApiSecret = null;
let isDebugMode = false;

self.onmessage = function(event) {
  const { type, payload } = event.data || {};

  switch (type) {
    case 'init':
      if (payload && payload.gaId) {
        currentGaId = payload.gaId;
        gaApiSecret = payload.gaApiSecret;
        isDebugMode = !!payload.isDebug;
        console.log(`📡 [Analytics Worker]: Инициализирован для GA4 ID: ${currentGaId}`);
      }
      break;

    // Опциональный кейс: если нужно обновлять режим отладки на лету при SPA переходах
    case 'update_debug':
      if (payload) {
        isDebugMode = !!payload.isDebug;
      }
      break;

    case 'track_pageview':
      if (!currentGaId) return;
      
      const pageViewParams = {
        page_location: payload.url,
        page_title: payload.title, // Наше предыдущее исправление заголовка
        engagement_time_msec: '100'
      };

      // 👇 Если включен дебаг, подмешиваем параметр во внутренний объект params
      if (isDebugMode) pageViewParams.debug_mode = 1;
      
      sendGA4Event({
        client_id: payload.clientId,
        events: [{
          name: 'page_view',
          params: pageViewParams
        }]
      });
      break;

    case 'track_event':
      if (!currentGaId) return;

      const { action, params, clientId } = payload;
      
      const customEventParams = {
        ...params,
        traffic_type: 'Рантайм Блога'
      };

      // Если включен дебаг, подмешиваем параметр к кастомному событию
      if (isDebugMode) customEventParams.debug_mode = 1;

      sendGA4Event({
        client_id: clientId,
        events: [{
          name: action, // В GA4 имя события (action) идет в поле name (например, 'generate_lead')
          params: customEventParams, // Все кастомные параметры передаются плоским объектом, JSON.stringify больше не нужен!
        }]
      });
      break;

    default:
      break;
  }
};

// Функция отправки для GA4
function sendGA4Event(bodyObject) {
  if (!currentGaId) return;

  const url = new URL('https://www.google-analytics.com/mp/collect');
  url.searchParams.set('measurement_id', currentGaId);
  url.searchParams.set('api_secret', gaApiSecret);

  const endpoint = url.toString();
  const jsonBody = JSON.stringify(bodyObject);

  // Используем Blob, чтобы гарантировать отправку чистого текста без искажений браузера
  const blob = new Blob([jsonBody], { type: 'text/plain;charset=UTF-8' });

  fetch(endpoint, {
    method: 'POST',
    mode: 'no-cors', // Возвращаем no-cors, чтобы избежать OPTIONS-запросов
    body: blob
  })
  .then(() => console.log('✅ Событие отправлено из воркера (статус скрыт no-cors)'))
  .catch(err => console.error('❌ Ошибка отправки из воркера:', err));
}
