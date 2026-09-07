import { NCodeSamplesSpace } from '~/types'

export interface IMdxFrontMatter {
  title?: string
  brief?: string
  bg_src?: string
  bg_size?: { w: number; h: number }
  bg_type?: string
  createdAt?: string
  updatedAt?: string
  priority?: number
  isPrivate?: boolean
  isDraft?: boolean
}

export interface IEnhancedArticle {
  original: NCodeSamplesSpace.TNote;
  slug?: string;
  brief?: string;
  bg?: {
    src?: string
    size?: { w: number; h: number }
    type?: string
  };
  isLocal?: boolean
}
