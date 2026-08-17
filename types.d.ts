// Объявляем дикую карту (wildcard) для CSS модулей и side-effect импортов
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}