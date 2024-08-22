export type TNormalizedItem = {
  src: string;
  original: string;
  width: number;
  height: number;
  tags: {
    value: string;
    title: string;
  }[];
  title?: string;
  caption?: string;
}
export type TProps = {
  itemsJson: string;
}
