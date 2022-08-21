type TProps = {
  spaceName: string;
  items: any[];
}

export const groupLog = ({ spaceName, items }: TProps): void => {
  console.groupCollapsed(spaceName)
    switch (true) {
      case Array.isArray(items):
        for (const msg of items) console.log(msg)
        break
      default:
        console.log(items)
        break
    }
   console.groupEnd()
}
