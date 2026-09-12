export namespace NCodeSamplesSpace {
  export type TNote = {
    _id: string;
    title: string;
    description: string;
    isPrivate: boolean;
    createdAt: string; // NOTE: 2023-08-01T10:00:59.251Z
    updatedAt: string; // NOTE: 2023-09-22T07:54:01.264Z
    priority: number;
    meta?: {
      description: string;
      "og:type": string;
      "og:title": string;
      "og:description": string;
      "og:image"?: string;
      "og:url"?: string;
      "profile:first_name": string;
      "profile:last_name": string;
      "profile:username": string;
      "og:locale"?: string;
      "og:locale:alternate"?: string;
    };
    category?: string;
  }
  export type TNotesListResponse = {
    success: boolean;
    data: TNote[];
    pagination: {
      totalPages: number;
      currentPage: number;
      totalNotes: number;
    };
  }
  export type TNotesListResponseModified = {
    success: boolean;
    data: { original: TNote; slug: string }[];
    pagination: {
      totalPages: number;
      currentPage: number;
      totalNotes: number;
    };
  }
  export type TSingleNoteResponse = {
    success: boolean;
    data: TNote;
  }
  export type TLocalNoteResponse = {
    success: boolean;
    data: TNote & {
      title: string
      brief: string
      bg?: {
        src: string
        size: { w: number; h: number }
        type: string
      }
      createdAt?: string
      updatedAt?: string
      priority?: number
      tags?: string[]
      category?: string
      isPrivate?: boolean
      author?: string
      id?: string | number // на случай, если id прокинут из базы
    };
  }
}