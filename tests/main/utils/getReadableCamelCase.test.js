import { getReadableCamelCase } from '@src/utils/getReadableCamelCase'

test('getReadableCamelCase HttpError -> Http Error', () => {
  const tested = getReadableCamelCase('HttpError');
  const expected = 'Http Error'

  expect(tested).toBe(expected);
});

test('getReadableCamelCase camelCase -> camel Case', () => {
  const tested = getReadableCamelCase('camelCase');
  const expected = 'camel Case'

  expect(tested).toBe(expected);
});
