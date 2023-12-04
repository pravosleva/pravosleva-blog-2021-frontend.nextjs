import { NCodeSamplesSpace } from '~/types'

export type TArticle = {
  slug: string;
  original: NCodeSamplesSpace.TNote;
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

export type TPageService = {
  isOk: boolean;
  message?: string;
  response?: NCodeSamplesSpace.TSingleNoteResponse;
  modifiedArticle: TArticle | null;
}

export type TArticleComponentProps = {
  article: TArticle;
  _pageService: TPageService;
  // t: (translatableString: string) => string;
}
