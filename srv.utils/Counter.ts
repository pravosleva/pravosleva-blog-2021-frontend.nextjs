export function* Counter(initValue: number = 0) {
  let count = initValue
  while (true) yield count++
}

// NOTE: Usage
// const counter = Counter()
// counter.next().value
