let currentYandexId = null;

self.onmessage = function(event) {
  const { type, payload } = event.data || {};

  switch (type) {
    case 'init':
      if (payload && payload.yandexId) {
        currentYandexId = payload.yandexId;
        console.log(`📻 [Yandex Worker]: Успешно инициализирован для ID: ${currentYandexId}`);
      }
      break;

    case 'track_pageview':
      if (currentYandexId && payload) {
        sendYandexHit({
          yandexId: currentYandexId,
          url: payload.url,
          referrer: payload.referrer,
          title: payload.title,
          screenResolution: payload.screenResolution,
          userLanguage: payload.userLanguage
        });
      }
      break;

    default:
      break;
  }
};

function sendYandexHit(data) {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const browserInfo = `ar:1:v:265:la:${data.userLanguage || 'ru'}:s:${data.screenResolution || '1920x1080x24'}:st:${timestamp}`;

    const __url = [
      'https://mc.yandex.ru',
      'watch',
      data.yandexId,
    ].join('/')
    const url = new URL(__url);
    
    url.searchParams.set('page-url', data.url);
    url.searchParams.set('page-ref', data.referrer || '');
    url.searchParams.set('browser-info', browserInfo);
    url.searchParams.set('t', data.title || '');
    url.searchParams.set('rn', Math.floor(Math.random() * 1000000000));

    // ИСПРАВЛЕНО: Чистый fetch без кастомных заголовков, прикидывающийся простым запросом за картинкой
    fetch(url.toString(), {
      method: 'GET'
    })
    .then(() => console.log('✅ [Yandex Worker]: Хит Метрики успешно доставлен.'))
    .catch(err => console.error('❌ [Yandex Worker]: Ошибка сети (CORS/Блокировщик):', err.message));
  } catch (e) {
    console.error('❌ [Yandex Worker]: Ошибка сборки пакета:', e);
  }
}
