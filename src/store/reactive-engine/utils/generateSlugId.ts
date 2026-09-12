// Хелпер для перевода кириллицы в латиницу (Транслитерация)
const translit = (str: string): string => {
  const ru: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
    'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
    'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ы': 'y', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'ъ': '', 'ь': ''
  };
  
  return str.split('').map(char => ru[char] || char).join('');
};

// Главная функция генерации валидного HTML ID
export const generateSlugId = (text: string): string => {
  const lowerText = text.toString().toLowerCase().trim();
  
  // Переводим русские буквы в латиницу перед очисткой спецсимволов
  const transliteratedText = translit(lowerText);

  return 'collapsible-' + transliteratedText
    .replace(/\s+/g, '-')            // Заменяем пробелы на дефисы
    .replace(/[^\w\-]+/g, '')        // Теперь \w (латиница и цифры) сработает идеально!
    .replace(/\-\-+/g, '-')          // Заменяем двойные дефисы на один
    .replace(/^-+/, '')              // Отрезаем дефисы в начале, если они появились
    .replace(/-+$/, '');             // Отрезаем дефисы в конце
};
