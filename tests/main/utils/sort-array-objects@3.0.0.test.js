import { sort } from '@src/utils/sort-array-objects@3.0.0'

test('sort-array-objects@3.0.0 | sort case 1 ASC', () => {
  const arr = [
    {
      ts: 1,
    },
    {
      ts: 2,
    },
  ]
  const tested = sort(
    arr,
    ['ts'],
    1,
  );
  const expected = [
    {
      ts: 1,
    },
    {
      ts: 2,
    },
  ]

  expect(tested).toEqual(expected);
});

test('sort-array-objects@3.0.0 | sort case 2 DESC', () => {
  const arr = [
    {
      ts: 1,
    },
    {
      ts: 2,
    },
  ]
  const tested = sort(
    arr,
    ['ts'],
    -1,
  );
  const expected = [
    {
      ts: 2,
    },
    {
      ts: 1,
    },
  ]

  expect(tested).toEqual(expected);
});

test('sort-array-objects@3.0.0 | sort case 3 (two keys) ASC', () => {
  const arr = [
    {
      ts: 1,
      priority: 1,
    },
    {
      ts: 2,
      priority: 2,
    },
  ]
  const tested = sort(
    arr,
    ['ts', 'priority'],
    1,
  );
  const expected = [
    {
      ts: 1,
      priority: 1,
    },
    {
      ts: 2,
      priority: 2,
    },
  ]

  expect(tested).toEqual(expected);
});

test('sort-array-objects@3.0.0 | sort case (two keys) 4.1 ASC', () => {
  const arr = [
    {
      ts: 1,
      priority: 2,
    },
    {
      ts: 2,
      priority: 2,
    },
    {
      ts: 2,
      priority: 1,
    },
  ]
  const tested = sort(
    arr,
    ['ts', 'priority'],
    1,
  );
  const expected = [
    {
      ts: 1,
      priority: 2,
    },
    {
      ts: 2,
      priority: 1,
    },
    {
      ts: 2,
      priority: 2,
    },
  ]

  expect(tested).toEqual(expected);
});

test('sort-array-objects@3.0.0 | sort case (two keys) 4.2 DESC', () => {
  const arr = [
    {
      ts: 1,
      priority: 2,
    },
    {
      ts: 2,
      priority: 2,
    },
    {
      ts: 2,
      priority: 1,
    },
  ]
  const tested = sort(
    arr,
    ['ts', 'priority'],
    -1,
  );
  const expected = [
    {
      ts: 2,
      priority: 2,
    },
    {
      ts: 2,
      priority: 1,
    },
    {
      ts: 1,
      priority: 2,
    },
  ]

  expect(tested).toEqual(expected);
});
