// src/utils/getTechnicalErrorText.ts
import clsx from "clsx";
import { IAudioTrack } from "~/store/reactive-engine/audio-podcast";

export const getTechnicalErrorText = (mediaError: MediaError | null, activeTrack: IAudioTrack): string => {
  let technicalReason = 'Неизвестная ошибка медиа-декодера';

  if (mediaError) {
    const code = mediaError.code;
    const message = mediaError.message || ''; 
    const lowerMessage = message.toLowerCase();

    switch (code) {
      case 1: // MEDIA_ERR_ABORTED
        technicalReason = clsx('[MEDIA_ERR_ABORTED]', 'Воспроизведение прервано системой.', message);
        break;
      case 2: // MEDIA_ERR_NETWORK
        technicalReason = clsx('[MEDIA_ERR_NETWORK]', 'Сетевой сбой. Файл не найден на сервере (404) или оборвалось соединение.', message);
        break;
      case 3: // MEDIA_ERR_DECODE
        technicalReason = clsx('[MEDIA_ERR_DECODE]', 'Ошибка декодирования. Битый формат файла или кодек не поддерживается.', message);
        break;
      case 4: { // MEDIA_ERR_SRC_NOT_SUPPORTED
        const isCrossOrigin = typeof window !== 'undefined' ? !activeTrack.url.includes(window.location.host) : false;
        
        /* =========================================================================
           АНАЛИЗ СОДЕРЖИМОГО ОШИБКИ: Разделяем 404 (Not Found) и CORS Mismatch
           ========================================================================= */
        let preciseReason = '';

        if (lowerMessage.includes('404') || lowerMessage.includes('not found') || lowerMessage.includes('empty response')) {
          preciseReason = 'Физическое отсутствие файла на сервере (Ошибка 404 Not Found) или пустой ответ.';
        } else if (lowerMessage.includes('format error') && !isCrossOrigin) {
          preciseReason = 'Файл существует, но его формат/кодек не поддерживается текущим браузером (Format Error).';
        } else if (isCrossOrigin) {
          // Если файл междоменный и упал с общим Format Error, даем развернутую подсказку для проверки сети
          preciseReason = 'Конфликт доступа. Либо файл удален с удаленного сервера (404), либо заблокирован политикой CORS (отсутствует Access-Control-Allow-Origin) при частичной отдаче Range 206.';
        } else {
          preciseReason = 'Не удалось загрузить медиа-ресурс. Проверьте валидность пути.';
        }

        technicalReason = clsx(
          '[MEDIA_ERR_SRC_NOT_SUPPORTED]',
          preciseReason,
          message ? `[Браузер: ${message}]` : ''
        );
        break;
      }
      default:
        technicalReason = clsx(`[Код: ${code}]`, `Критический сбой рантайма: ${message}`);
    }
  }

  return technicalReason;
}
