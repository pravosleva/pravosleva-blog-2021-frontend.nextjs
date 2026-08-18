/**
 * Функция для плюрализации (склонения) существительных в зависимости от числительного
 * @param count - Число
 * @param titles - Массив из 3-х форм [одна, две, пять] (например: ['находка', 'находки', 'находок'])
 * @param includeCount - Флаг, нужно ли добавлять само число в итоговую строку (по умолчанию true)
 */
export function pluralize({ count, titles, includeCount = true }: {
  count: number;
  titles: [string, string, string];
  includeCount?: boolean;
}): string {
  const absCount = Math.abs(count);
  const cases =[2, 0, 1, 1, 1, 2];
  
  // Вычисляем индекс нужного склонения по математическому алгоритму
  const index =
    absCount % 100 > 4 && absCount % 100 < 20
      ? 2
      : cases[absCount % 10 < 5 ? absCount % 10 : 5];

  const word = titles[index];

  return includeCount ? `${count} ${word}` : word;
}
