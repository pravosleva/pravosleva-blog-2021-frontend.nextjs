## Варианты доработки проверки безопасности токена в `getInitialProps`

### ⚡ Вариант 2. Декодирование структуры JWT без валидации подписи (Слой инспекции)
Поскольку JWT-токен состоит из трех частей, разделенных точками (`header.payload.signature`), мы можем прямо в браузере распарсить его центральную часть (`payload`) через `atob()` без отправки запроса на бэкенд и проверить срок её годности (`exp`).
```ts
if (typeof window !== 'undefined' && !isAuthorized) {
  const cookieMatch = document.cookie.match(/(^|;)\s*autopark-2022\.jwt\s*=\s*([^;]+)/);
  const token = cookieMatch ? cookieMatch[2] : null;

  if (token) {
    try {
      const payloadPart = token.split('.')[1];
      if (payloadPart) {
        // Декодируем base64 payload токена
        const payload = JSON.parse(window.atob(payloadPart));
        const currentTime = Math.floor(Date.now() / 1000);
        
        // Если токен не протух по времени (время exp в секундах)
        if (payload?.exp && payload.exp > currentTime) {
          isAuthorized = true;
        }
      }
    } catch (e) {
      console.error('🚨 [JWT Parse Error]: Токен поврежден или невалиден', e);
    }
  }
}
```
- **Плюсы:** Позволяет клиенту узнать, что токен реально живой по времени, защищая от ситуации, когда протухшая кука пытается ложно удержать интерфейс админки.

### 🔒 Вариант 3. Асинхронный вызов `checkJWT` (Абсолютная безопасность / Системный бастион)
При каждом SPA-переходе клиент делает короткий асинхронный вызов к вашему методу `autoparkHttpClient.checkJWT`. Бэкенд на сервере проверяет криптографическую подпись токена своим секретным ключом.
```ts
if (typeof window !== 'undefined' && !isAuthorized && !!chat_id) {
  try {
    // Вызываем наш строго отрефакторенный метод checkJWT
    const jwtCheckResult = await autoparkHttpClient.checkJWT({ tested_chat_id: chat_id });
    if (jwtCheckResult?.ok === true) {
      isAuthorized = true;
      store.dispatch(setIsOneTimePasswordCorrect(true));
    }
  } catch (jwtErr) {
    // Если бэкенд отклонил подпись токена — промис зарейектится, и мы плавно уйдем на редирект
    console.warn('🔒 [Security Alert]: Попытка обхода авторизации отклонена бэкендом.');
  }
}
```
- **Плюсы:** Стопроцентная защита банковского уровня. Исключает любой взлом или подделку кук на клиенте.- **Минусы:** Появляется один дополнительный асинхронный сетевой запрос при кликах по кнопкам «Назад/Гараж».
