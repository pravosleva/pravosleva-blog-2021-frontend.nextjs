// public/static/workers/code-diff.worker.js

self.onmessage = function (e) {
  const { oldCode, newCode } = e.data;

  const oldLines = oldCode ? oldCode.split('\n') : [];
  const newLines = newCode ? newCode.split('\n') : [];

  let oldIdx = 0;
  let newIdx = 0;

  const resultOld = [];
  const resultNew = [];
  const resultUnified = []; // Новый плоский массив для одной колонки

  while (oldIdx < oldLines.length || newIdx < newLines.length) {
    const lineOld = oldLines[oldIdx];
    const lineNew = newLines[newIdx];

    if (lineOld === lineNew) {
      const row = { type: 'normal', text: lineOld, oldNum: oldIdx + 1, newNum: newIdx + 1 };
      resultOld.push({ type: 'normal', text: lineOld, num: oldIdx + 1 });
      resultNew.push({ type: 'normal', text: lineNew, num: newIdx + 1 });
      resultUnified.push(row);
      oldIdx++;
      newIdx++;
    } else if (oldIdx < oldLines.length && !newLines.includes(lineOld)) {
      const row = { type: 'deleted', text: lineOld, oldNum: oldIdx + 1, newNum: null };
      resultOld.push({ type: 'deleted', text: lineOld, num: oldIdx + 1 });
      resultNew.push({ type: 'empty', text: '', num: null });
      resultUnified.push(row);
      oldIdx++;
    } else if (newIdx < newLines.length && !oldLines.includes(lineNew)) {
      const row = { type: 'added', text: lineNew, oldNum: null, newNum: newIdx + 1 };
      resultOld.push({ type: 'empty', text: '', num: null });
      resultNew.push({ type: 'added', text: lineNew, num: newIdx + 1 });
      resultUnified.push(row);
      newIdx++;
    } else {
      const rowOld = { type: 'modified-old', text: lineOld || '', oldNum: oldIdx + 1, newNum: null };
      const rowNew = { type: 'modified-new', text: lineNew || '', oldNum: null, newNum: newIdx + 1 };
      
      resultOld.push({ type: 'modified-old', text: lineOld || '', num: oldIdx + 1 });
      resultNew.push({ type: 'modified-new', text: lineNew || '', num: newIdx + 1 });
      
      resultUnified.push(rowOld);
      resultUnified.push(rowNew);
      
      oldIdx++;
      newIdx++;
    }
  }

  // Отдаем в React все три готовых массива данных
  self.postMessage({ resultOld, resultNew, resultUnified });
};
