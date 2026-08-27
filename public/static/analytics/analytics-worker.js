// public/analytics-worker.js

let currentGaId = null;

self.onmessage = function(event) {
  const { type, payload } = event.data || {};

  switch (type) {
    case 'init':
      if (payload && payload.gaId) {
        currentGaId = payload.gaId;
        console.log(`📡 [Analytics Worker]: Инициализирован для ID: ${currentGaId}`);
      }
      break;

    /* =========================================================================
       ОБРАБОТКА: Просмотр страниц (Pageview)
       ========================================================================= */
    case 'track_pageview':
      if (!currentGaId) return;
      
      const pvParams = new URLSearchParams({
        v: '1',
        tid: currentGaId,
        cid: payload.clientId,
        t: 'pageview',
        dp: payload.url
      });

      sendHit(pvParams.toString());
      break;

    /* =========================================================================
       НОВОЕ: Обработка кастомных событий (ga.event) через REST API
       ========================================================================= */
    case 'track_event':
      if (!currentGaId) return;

      const { action, params, clientId } = payload;
      
      // Формируем базовый пакет ивента по спецификации Measurement Protocol v1
      const eventParams = {
        v: '1',
        tid: currentGaId,
        cid: clientId,
        t: 'event',            // Тип хита — строго event
        ea: action,            // Event Action (например, 'search' или 'play_podcast')
        ec: 'Рантайм Блога',    // Категория по умолчанию
      };

      // Если в params передали дополнительные свойства (например, search_term, track_id)
      // мы можем зашить их в Event Label (el) в виде JSON строки, чтобы не терять контекст
      if (params && Object.keys(params).length > 0) {
        // @ts-ignore
        eventParams.el = JSON.stringify(params);
      }

      const bodyPayload = new URLSearchParams(eventParams);

      sendHit(bodyPayload.toString());
      break;

    default:
      break;
  }
};

// Выделенная функция отправки HTTP POST запроса
function sendHit(queryString) {
  fetch('https://google-analytics.com', {
    method: 'POST',
    body: queryString,
    mode: 'no-cors'
  }).catch(err => console.warn('❌ Ошибка отправки ивента из воркера:', err));
}
