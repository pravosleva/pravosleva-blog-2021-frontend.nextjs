export interface IDiffLine {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
}

export function diffLines(oldLines: string[], newLines: string[]): IDiffLine[] {
  const shortOld = oldLines;
  const shortNew = newLines;
  
  // Матрица для алгоритма LCS (Наибольшая общая подпоследовательность)
  const dp: number[][] = Array(shortOld.length + 1)
    .fill(null)
    .map(() => Array(shortNew.length + 1).fill(0));

  for (let i = 1; i <= shortOld.length; i++) {
    for (let j = 1; j <= shortNew.length; j++) {
      if (shortOld[i - 1] === shortNew[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: IDiffLine[] = [];
  let i = shortOld.length;
  let j = shortNew.length;

  // Восстанавливаем путь по матрице с конца
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && shortOld[i - 1] === shortNew[j - 1]) {
      result.unshift({ type: 'unchanged', value: shortOld[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added', value: shortNew[j - 1] });
      j--;
    } else {
      result.unshift({ type: 'removed', value: shortOld[i - 1] });
      i--;
    }
  }

  return result;
}
