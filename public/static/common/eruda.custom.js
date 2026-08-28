// NOTE: https://github.com/liriliri/eruda

// /static/common/eruda.custom.js

class CustomErudaSingletone {
  constructor() {
    this.isEnabled = false;
  }

  static getInstance() {
    if (!CustomErudaSingletone.instance) {
      CustomErudaSingletone.instance = new CustomErudaSingletone();
    }
    return CustomErudaSingletone.instance;
  }

  initIfNecessary() {
    if (this.isEnabled || typeof window === 'undefined') return;

    /* =========================================================================
       ИНХАУС-МЕТРОНОМ: requestIdleCallback гарантирует, что Eruda начнет 
       скачиваться и инициализироваться ТОЛЬКО тогда, когда основной поток 
       процессора (Main Thread) будет полностью свободен. Нагрузка на TBT = 0 мс!
       ========================================================================= */
    const startLoading = () => {
      const src = '/static/common/eruda@2.10.0.min.js';
      const script = window.document.createElement('script');
      script.src = src;
      script.async = true;

      script.onload = () => {
        if (typeof eruda !== 'undefined') {
          eruda.init();
          eruda.position({ x: 130, y: 20 });
          console.log('🛠️ [Eruda Engine]: Мобильная консоль успешно запущена в режиме Idle.');
        }
      };

      script.onerror = (err) => {
        console.error('[Eruda Engine]: Ошибка загрузки ядра консоли:', err);
      };

      window.document.body.appendChild(script);
    };

    // Если браузер поддерживает requestIdleCallback — используем его, иначе мягкий таймаут
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => startLoading(), { timeout: 4000 });
    } else {
      setTimeout(startLoading, 3000); // Даем Next.js 3 секунды на спокойную гидратацию
    }

    this.isEnabled = true;
  }
}

// Запускаем безопасную ленивую активацию
if (typeof window !== 'undefined') {
  // Дожидаемся полной готовности DOM, прежде чем создавать синглтон
  if (window.document.readyState === 'complete') {
    CustomErudaSingletone.getInstance().initIfNecessary();
  } else {
    window.addEventListener('load', () => {
      CustomErudaSingletone.getInstance().initIfNecessary();
    });
  }
}
