export const createDiffWorker = () => {
  const workerCode = () => {
    self.onmessage = (e: MessageEvent) => {
      const { oldLines, newLines } = e.data;

      // 1. Алгоритм LCS для построчного сравнения
      const dp: number[][] = Array(oldLines.length + 1)
        .fill(null)
        .map(() => Array(newLines.length + 1).fill(0));

      for (let i = 1; i <= oldLines.length; i++) {
        for (let j = 1; j <= newLines.length; j++) {
          if (oldLines[i - 1] === newLines[j - 1]) {
            dp[i][j] = dp[i - 1][j - 1] + 1;
          } else {
            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          }
        }
      }

      const result: any[] = [];
      let i = oldLines.length;
      let j = newLines.length;

      while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
          result.unshift({ type: 'unchanged', value: oldLines[i - 1] });
          i--;
          j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
          result.unshift({ type: 'added', value: newLines[j - 1] });
          j--;
        } else {
          result.unshift({ type: 'removed', value: oldLines[i - 1] });
          i--;
        }
      }

      // 2. Пост-обработка: Сглаживание запятых
      // Если рядом стоят удаленная и добавленная строки, отличающиеся только запятой на конце,
      // мы можем пометить их специальным типом, чтобы не пугать пользователя полной заменой строки.
      for (let k = 0; k < result.length - 1; k++) {
        const current = result[k];
        const next = result[k + 1];

        if (
          (current.type === 'removed' && next.type === 'added') ||
          (current.type === 'added' && next.type === 'removed')
        ) {
          const cleanCur = current.value.trim().replace(/,$/, '');
          const cleanNext = next.value.trim().replace(/,$/, '');

          if (cleanCur === cleanNext) {
            current.commaOnly = true;
            next.commaOnly = true;
          }
        }
      }

      self.postMessage(result);
    };
  };

  const codeStr = `(${workerCode.toString()})()`;
  const blob = new Blob([codeStr], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
};
