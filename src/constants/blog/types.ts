export type TArticleTools = {
  id: string;
  title?: string;
  brief: string;
  bg?: {
    src: string;
    size: {
      w: number;
      h: number;
    };
    type: string;
  };
  priority?: number;
}
