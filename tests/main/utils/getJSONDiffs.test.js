import { getJSONDiffs } from '@src/utils/getJSONDiffs'

test('getJSONDiffs level 1 | case 1', () => {
  const json1 = {
    a: 1,
  }
  const json2 = {
    a: 2,
  }
  const tested = getJSONDiffs(json1, json2);
  const expected = {
    a: 2,
  }

  expect(tested).toEqual(expected);
});

test('getJSONDiffs level 1 | case 2', () => {
  const json1 = {
    a: 1,
  }
  const json2 = {
    a: 1,
  }
  const tested = getJSONDiffs(json1, json2);
  const expected = {}

  expect(tested).toEqual(expected);
});

test('getJSONDiffs level 2 | Nested case 1', () => {
  const json1 = {
    nested1: {
      a: 1,
    },
    nested2: {
      a: 2,
    },
  }
  const json2 = {
    a: 1,
  }
  const tested = getJSONDiffs(json1, json2);
  const expected = {
    a: 1,
  }

  expect(tested).toEqual(expected);
});

test('getJSONDiffs level 2 | Nested case 2', () => {
  const json1 = {
    nested1: {
      a: 1,
    },
    nested2: {
      a: 2,
    },
  }
  const json2 = {
    nested2: {
      a: 2,
    },
  }
  const tested = getJSONDiffs(json1, json2);
  const expected = {
    nested2: {},
  }

  expect(tested).toEqual(expected);
});

test('getJSONDiffs level 2 | Nested case 3', () => {
  const json1 = {
    nested1: {
      a: 1,
    },
    nested2: {
      a: 2,
    },
  }
  const json2 = {
    nested2: {
      a: 1,
    },
  }
  const tested = getJSONDiffs(json1, json2);
  const expected = {
    nested2: {
      a: 1,
    },
  }

  expect(tested).toEqual(expected);
});
