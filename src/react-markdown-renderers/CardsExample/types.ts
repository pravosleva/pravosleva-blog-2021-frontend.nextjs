type TLink = {
  url: string;
  title: string;
}

export type TNormalizedItem = {
  id: number;
  title: string;
  descr?: string;
  bgUrl?: string;
  links?: TLink[];
}

export type TProps = {
  itemsJson: string;
}
