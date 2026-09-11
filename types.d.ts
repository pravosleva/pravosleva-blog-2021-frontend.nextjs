// 1. Объявляем дикую карту (wildcard) для CSS модулей и side-effect импортов
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// 2. Расширяем глобальный интерфейс Window для ленивой отладки Яндекс.Метрики
// Используем глобальное пространство имен, чтобы типы были доступны во всех компонентах
interface Window {
  ym?: {
    (...args: any[]): void;
    a?: any[];
    l?: number;
  };
}
