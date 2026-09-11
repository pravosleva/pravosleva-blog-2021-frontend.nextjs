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

    if (lineOld === lineNew) {
      const row = { type: 'normal', text: lineOld };
      resultOld.push({ type: 'normal', text: lineOld });
      resultNew.push({ type: 'normal', text: lineNew });
      resultUnified.push(row);
      oldIdx++;
      newIdx++;
    } else if (oldIdx < oldLines.length && !newLines.includes(lineOld)) {
      const row = { type: 'removed', text: lineOld };
      resultOld.push({ type: 'removed', text: lineOld });
      resultNew.push({ type: 'empty', text: '' });
      resultUnified.push(row);
      oldIdx++;
    } else if (newIdx < newLines.length && !oldLines.includes(lineNew)) {
      const row = { type: 'added', text: lineNew };
      resultOld.push({ type: 'empty', text: '' });
      resultNew.push({ type: 'added', text: lineNew });
      resultUnified.push(row);
      newIdx++;
    } else {
      const rowOld = { type: 'removed', text: lineOld || '' };
      const rowNew = { type: 'added', text: lineNew || '' };
      
      resultOld.push({ type: 'removed', text: lineOld || '' });
      resultNew.push({ type: 'added', text: lineNew || '' });
      
      resultUnified.push(rowOld);
      resultUnified.push(rowNew);
      
      oldIdx++;
      newIdx++;
    }
  }

  self.postMessage({ resultOld, resultNew, resultUnified });
};
