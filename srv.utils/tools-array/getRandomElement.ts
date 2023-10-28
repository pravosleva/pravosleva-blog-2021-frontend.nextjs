export const getRandomElement = <TElement>({ items }: { items: TElement[] }): TElement => {
  return items[Math.floor(Math.random() * items.length)]
}
