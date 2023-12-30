import { getTimeAgo } from '@src/utils/time-tools/getTimeAgo'

test.skip('getTimeAgo', () => {
  const ts = 1701677752573 // new Date().getTime();
  const tested = getTimeAgo(ts);
  const expected = ''

  expect(tested).toBe(expected);
});
