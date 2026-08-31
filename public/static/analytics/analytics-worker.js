let currentGaId = null;
// ⚠️ Для GA4 Measurement Protocol ОГОВОРКА: строго необходим api_secret.
// Получить его нужно в админке GA4 (Потоки данных -> Твой поток -> Секретные ключи Measurement Protocol)
let gaApiSecret = null

self.onmessage = function(event) {
  const { type, payload } = event.data || {};

  switch (type) {
    case 'init':
      if (payload && payload.gaId) {
        currentGaId = payload.gaId;
        gaApiSecret = payload.gaApiSecret;
        console.log(`📡 [Analytics Worker]: Инициализирован для GA4 ID: ${currentGaId}`);
      }
      break;

    case 'track_pageview':
      if (!currentGaId) return;
      
      sendGA4Event({
        client_id: payload.clientId,
        events: [{
          name: 'page_view', // В GA4 это стандартное событие
          params: {
            page_location: payload.url,
            engagement_time_msec: '100' // Желательно для корректных сессий
          }
        }]
      });
      break;

    case 'track_event':
      if (!currentGaId) return;

      const { action, params, clientId } = payload;
      
      sendGA4Event({
        client_id: clientId,
        events: [{
          name: action, // В GA4 имя события (action) идет в поле name (например, 'generate_lead')
          params: {
            ...params, // Все кастомные параметры передаются плоским объектом, JSON.stringify больше не нужен!
            traffic_type: 'Рантайм Блога' 
          }
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
