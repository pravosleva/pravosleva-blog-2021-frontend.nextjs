// Хелпер для генерации валидного HTML ID из заголовка
export const generateSlugId = (text: string): string => {
  return 'collapsible-' + text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}
