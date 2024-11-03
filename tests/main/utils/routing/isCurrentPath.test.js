import { isCurrentPath } from '@src/utils/routing/isCurrentPath'

test('isCurrentPath case 1', () => {
  const path = '/blog/q/git'
  const testedPath = '/blog/q/git'
  const testedResult = isCurrentPath(testedPath, path);
  const expectedResult = true

  expect(testedResult).toEqual(expectedResult);
});

test('isCurrentPath case 2 (decoded router.asPath)', () => {
  const path = '/blog/q/краснаяАкула'
  const testedPath = '/blog/q/%D0%BA%D1%80%D0%B0%D1%81%D0%BD%D0%B0%D1%8F%D0%90%D0%BA%D1%83%D0%BB%D0%B0'
  const testedResult = isCurrentPath(testedPath, path);
  const expectedResult = true

  expect(testedResult).toEqual(expectedResult);
});
