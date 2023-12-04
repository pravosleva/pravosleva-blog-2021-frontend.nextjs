import * as timeConverter from '@src/utils/timeConverter'

test('timeConverter.getNormalizedDateTime', () => {
  const ts = 1701677752573
  const tested = timeConverter.getNormalizedDateTime(ts);
  const expected = '04.12.2023 в 11:15'

  expect(tested).toBe(expected);
});

test('timeConverter.getNormalizedDate', () => {
  const ts = 1701677752573
  const tested = timeConverter.getNormalizedDate(ts);
  const expected = '04.12.2023'

  expect(tested).toBe(expected);
});

test('timeConverter.getDayMonth', () => {
  const ts = 1701677752573
  const tested = timeConverter.getDayMonth(ts);
  const expected = '04.12'

  expect(tested).toBe(expected);
});

test('timeConverter.getNormalizedDateTime2', () => {
  const ts = 1701677752573
  const tested = timeConverter.getNormalizedDateTime2(ts);
  const expected = '04.12.2023 11:15:52'

  expect(tested).toBe(expected);
});

test('timeConverter.getNormalizedDateTime3', () => {
  const ts = 1701677752573
  const tested = timeConverter.getNormalizedDateTime3(ts);
  const expected = '04.12.2023 11:15'

  expect(tested).toBe(expected);
});

test('timeConverter.getFormatedDate2', () => {
  const ts = new Date(1701677752573)
  const tested = timeConverter.getFormatedDate2(ts);
  const expected = '04 дек, 2023'

  expect(tested).toBe(expected);
});
