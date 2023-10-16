import { TTask } from '~/components/time-scoring/types'

export const arithmeticalMean = (arr: any) => {
  const average = (ar: any[]) => ar.reduce((p, c) => p + c, 0) / ar.length

  const result = average([...arr])
  return result
}

type TProps = {
  theTaskList: (TTask & { startDate: number; realFinishDate: number })[];
  employee: string;
  testDiff: any;
  testStart: any;
}
type TResult = {
  averageSpeed: number;
  averageValue: number;
  date50: number;
}

export const getAverageResult = ({
  theTaskList,
  // employee,
  testDiff,
  testStart,
}: TProps): TResult => {
  // 24.10= 1543006800000 | 22.10= 1542834000000 (разница= 172800000)
  // console.log(testStart, testFinish);

  const result: any = {}
  // const testDiff = testFinish - testStart;

  if (theTaskList.length === 0 || testDiff === 0) {
    result.averageSpeed = 1
    result.averageValue = testStart
  } else {
    const speeds = theTaskList.map(
      (e) =>
        (e.forecastFinishDate / 1000 - e.startDate / 1000) /
        (e.realFinishDate / 1000 - e.startDate / 1000)
    )

    const testPredSorted = speeds
      .map((v) => testDiff / v)
      .sort((e1, e2) => e1 - e2)

    // const averageValue = testPredSorted[Number((testPredSorted.length/2).toFixed(0))];
    const averageValue =
      testPredSorted.length % 2 === 0
        ? Math.floor(
            arithmeticalMean([
              testPredSorted[Math.floor(testPredSorted.length / 2) - 1],
              testPredSorted[Math.floor(testPredSorted.length / 2)],
            ])
          )
        : Math.floor(testPredSorted[Math.floor(testPredSorted.length / 2)])

    // specialLog(`getAverageResult() | theTaskList.length= ${theTaskList.length}`, null, [
    //   `testPredSorted= ${testPredSorted}`,
    //   `averageValue= ${averageValue}`,
    //   `index= ${Math.floor(testPredSorted.length/2)}`,
    //   // `testPredSorted= ${testPredSorted}`,
    // ]);

    result.averageSpeed = arithmeticalMean(speeds)
    result.averageValue = averageValue
    result.date50 = averageValue + testStart
    // console.log(result.date50);
  }
  return result
}
