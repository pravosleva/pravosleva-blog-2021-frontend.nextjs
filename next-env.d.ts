/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.

// Объявляем дикую карту (wildcard) для CSS модулей и side-effect импортов
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
