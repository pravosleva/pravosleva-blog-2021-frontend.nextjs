import { IHeadingStoredItem } from "~/store/reactiveCollapsibleStore";

const getHeadingColor = ({ item, idx, startIndex, currentTheme, globalActiveIndex }: {
  item: IHeadingStoredItem;
  idx: number;
  startIndex: number;
  currentTheme: 'light' | 'gray' | 'hard-gray' | 'dark';
  globalActiveIndex: number;
}) => {
  const globalIndex = startIndex + idx
  const isDarkTheme = currentTheme === 'dark' || currentTheme === 'hard-gray'

  if (item.isActiveProgress || item.isVisible) {
    switch (currentTheme) {
      case 'hard-gray': case 'gray': return '#39e5ac'
      default: return '#FF8E53'
    }
    
  }
  if (globalIndex < globalActiveIndex) {
    return isDarkTheme ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)' // Прочитан
  }
  return isDarkTheme ? '#ffffff' : '#000000' // Не прочитан
}
