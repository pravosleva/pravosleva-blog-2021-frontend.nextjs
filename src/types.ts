export namespace NCodeSamplesSpace {
  export type TNote = {
    _id: string;
    title: string;
    description: string;
    isPrivate: boolean;
    createdAt: string; // NOTE: 2023-08-01T10:00:59.251Z
    updatedAt: string; // NOTE: 2023-09-22T07:54:01.264Z
    priority: number;
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
  export type TSingleNoteResponse = {
    success: boolean;
    data: TNote;
  }
}