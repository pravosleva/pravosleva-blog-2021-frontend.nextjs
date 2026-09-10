// public/static/workers/code-diff.worker.js

self.onmessage = function (e) {
  const { oldCode, newCode } = e.data;

  const oldLines = oldCode ? oldCode.split('\n') : [];
  const newLines = newCode ? newCode.split('\n') : [];

  // Алгоритм построчного сравнения (Упрощенный LCS / Линейный диффер)
  let oldIdx = 0;
  let newIdx = 0;

  const resultOld = [];
  const resultNew = [];

  while (oldIdx < oldLines.length || newIdx < newLines.length) {
    const lineOld = oldLines[oldIdx];
    const lineNew = newLines[newIdx];

    if (lineOld === lineNew) {
      // Строки полностью совпадают
      resultOld.push({ type: 'normal', text: lineOld, num: oldIdx + 1 });
      resultNew.push({ type: 'normal', text: lineNew, num: newIdx + 1 });
      oldIdx++;
      newIdx++;
    } else if (oldIdx < oldLines.length && !newLines.includes(lineOld)) {
      // Строка была удалена из старого кода
      resultOld.push({ type: 'deleted', text: lineOld, num: oldIdx + 1 });
      resultNew.push({ type: 'empty', text: '', num: null });
      oldIdx++;
    } else if (newIdx < newLines.length && !oldLines.includes(lineNew)) {
      // Строка была добавлена в новый код
      resultOld.push({ type: 'empty', text: '', num: null });
      resultNew.push({ type: 'added', text: lineNew, num: newIdx + 1 });
      newIdx++;
    } else {
      // Строка была изменена (модифицирована)
      resultOld.push({ type: 'modified-old', text: lineOld || '', num: oldIdx + 1 });
      resultNew.push({ type: 'modified-new', text: lineNew || '', num: newIdx + 1 });
      oldIdx++;
      newIdx++;
    }
  }

  // Отправляем результат обратно в основной поток React
  self.postMessage({ resultOld, resultNew });
};
