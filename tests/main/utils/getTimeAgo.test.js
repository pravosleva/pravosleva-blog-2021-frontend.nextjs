import { getTimeAgo } from '@src/utils/getTimeAgo'

test.skip('getTimeAgo', () => {
  const ts = 1701677752573 // new Date().getTime();
  const tested = getTimeAgo(ts);
  const expected = ''

  expect(tested).toBe(expected);
});
