// types/partytown.d.ts

declare module '@builder.io/partytown/react' {
  import React from 'react';
  
  export interface PartytownProps {
    /** Включение дебаг-логов в консоли браузера */
    debug?: boolean;
    /** Массив глобальных объектов/методов для проксирования в Web Worker (например, ['dataLayer.push']) */
    forward?: string[];
    /** Путь к статическим скриптам воркера в папке public */
    lib?: string;
  }

  export const Partytown: React.ComponentType<PartytownProps>;
}
