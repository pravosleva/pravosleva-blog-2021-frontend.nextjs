export type TArticleTools = {
  id: string;
  brief: string;
  bg?: {
    src: string;
    size: {
      w: number;
      h: number;
    };
    type: string;
  };
}
