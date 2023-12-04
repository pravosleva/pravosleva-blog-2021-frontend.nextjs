import { getTstValue } from '~/srv.utils/getTstValue'

test('getTstValue', () => {
  const tested = getTstValue(1);
  const expected = 1

  expect(tested).toBe(expected);
});
