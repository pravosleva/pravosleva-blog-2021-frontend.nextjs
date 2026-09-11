self.onmessage = function (e) {
  const { oldCode, newCode } = e.data;

  const oldLines = oldCode ? oldCode.split('\n') : [];
  const newLines = newCode ? newCode.split('\n') : [];

  let oldIdx = 0;
  let newIdx = 0;

  const resultOld = [];
  const resultNew = [];
  const resultUnified = [];

  while (oldIdx < oldLines.length || newIdx < newLines.length) {
    const lineOld = oldLines[oldIdx];
    const lineNew = newLines[newIdx];

    // 1. ПОЛНОЕ СОВПАДЕНИЕ СТРОК
    if (oldIdx < oldLines.length && newIdx < newLines.length && lineOld === lineNew) {
      const row = { type: 'normal', text: lineOld };
      resultOld.push({ type: 'normal', text: lineOld });
      resultNew.push({ type: 'normal', text: lineNew });
      resultUnified.push(row);
      oldIdx++;
      newIdx++;
    } 
    // 2. АНАЛИЗ СДВИГОВ И ВСТАВОК (Смотрим вперед)
    else {
      let matchNewSteps = -1;
      let matchOldSteps = -1;

      // Проверяем, добавились ли новые строки в модифицированный код
      for (let i = newIdx; i < newLines.length; i++) {
        if (newLines[i] === lineOld) {
          matchNewSteps = i - newIdx;
          break;
        }
      }

      // Проверяем, удалились ли строки из оригинального кода
      for (let i = oldIdx; i < oldLines.length; i++) {
        if (oldLines[i] === lineNew) {
          matchOldSteps = i - oldIdx;
          break;
        }
      }

      // Кейс А: Обнаружено добавление новых строк в новый код
      if (matchNewSteps !== -1 && (matchOldSteps === -1 || matchNewSteps <= matchOldSteps)) {
        // ИСПРАВЛЕНО: Жестко фиксируем целевой индекс до старта цикла, чтобы избежать бесконечного зацикливания!
        const targetIdx = newIdx + matchNewSteps;
        while (newIdx < targetIdx) {
          const addedLine = newLines[newIdx];
          resultOld.push({ type: 'empty', text: '' });
          resultNew.push({ type: 'added', text: addedLine });
          resultUnified.push({ type: 'added', text: addedLine });
          newIdx++;
        }
      } 
      // Кейс Б: Обнаружено удаление строк из старого кода
      else if (matchOldSteps !== -1) {
        // ИСПРАВЛЕНО: Точно так же жестко фиксируем верхнюю границу для удаления
        const targetIdx = oldIdx + matchOldSteps;
        while (oldIdx < targetIdx) {
          const removedLine = oldLines[oldIdx];
          resultOld.push({ type: 'removed', text: removedLine });
          resultNew.push({ type: 'empty', text: '' });
          resultUnified.push({ type: 'removed', text: removedLine });
          oldIdx++;
        }
      } 
      // Кейс В: Прямая замена одной строки на другую (модификация без сдвигов)
      else {
        if (oldIdx < oldLines.length && newIdx < newLines.length) {
          resultOld.push({ type: 'removed', text: lineOld });
          resultNew.push({ type: 'added', text: lineNew });
          resultUnified.push({ type: 'removed', text: lineOld });
          resultUnified.push({ type: 'added', text: lineNew });
          oldIdx++;
          newIdx++;
        } else if (oldIdx < oldLines.length) {
          resultOld.push({ type: 'removed', text: lineOld });
          resultNew.push({ type: 'empty', text: '' });
          resultUnified.push({ type: 'removed', text: lineOld });
          oldIdx++;
        } else if (newIdx < newLines.length) {
          resultOld.push({ type: 'empty', text: '' });
          resultNew.push({ type: 'added', text: lineNew });
          resultUnified.push({ type: 'added', text: lineNew });
          newIdx++;
        }
      }
    }
  }

  // Отправляем чистые данные обратно в React-компонент
  self.postMessage({ resultOld, resultNew, resultUnified });
};
