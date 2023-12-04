import { sort } from '@src/utils/sort-array-objects@3.0.0'

test('sort-array-objects@3.0.0 | todos case 1 ASC', () => {
  const arr = [
    {
      priority: 1,
      updatedAt: '2023-11-19T01:13:03.482Z',
    },
    {
      priority: 2,
      updatedAt: '2023-12-19T01:13:03.482Z',
    },
  ]
  const tested = sort(
    arr,
    ['priority', 'updatedAt'],
    1,
  );
  const expected = [
    {
      priority: 1,
      updatedAt: '2023-11-19T01:13:03.482Z',
    },
    {
      priority: 2,
      updatedAt: '2023-12-19T01:13:03.482Z',
    },
  ]

  expect(tested).toEqual(expected);
});

test('sort-array-objects@3.0.0 | todos case 2 DESC', () => {
  const arr = [
    {
      priority: 1,
      updatedAt: '2023-11-19T01:13:03.483Z',
    },
    {
      priority: 2,
      updatedAt: '2023-11-19T01:13:03.482Z',
    },
    {
      priority: 2,
      updatedAt: '2023-12-19T01:13:03.482Z',
    },
  ]
  const tested = sort(
    arr,
    ['priority', 'updatedAt'],
    -1,
  );
  const expected = [
    {
      priority: 2,
      updatedAt: '2023-12-19T01:13:03.482Z',
    },
    {
      priority: 2,
      updatedAt: '2023-11-19T01:13:03.482Z',
    },
    {
      priority: 1,
      updatedAt: '2023-11-19T01:13:03.483Z',
    },
  ]

  expect(tested).toEqual(expected);
});

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
