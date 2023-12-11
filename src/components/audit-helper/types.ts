export enum ESubjobStatus {
  IN_PROGRESS = "inProgress",
  IS_DONE = "isDone",
}
export type TSubJob = {
  id: string;
  status: ESubjobStatus;
  name: string;
  description?: string;
  
  tsCreate: number;
  tsUpdate: number;
}
export enum EJobStatus {
  IN_PROGRESS = "inProgress",
  IS_DONE = "isDone",
  IS_NOT_AVAILABLE = "isNotAvailable",
}
export interface IJob {
  id: string;
  status: EJobStatus;
  name: string;
  description?: string;
  subjobs: TSubJob[];

  tsCreate: number;
  tsUpdate: number;
}
export type TAudit = {
  id: string;
  name: string;
  description?: string;
  jobs: IJob[];
  comment?: string;

  tsCreate: number;
  tsUpdate: number;
}

// -- NOTE: New 2023.11 (client 1/2)
export namespace NTodo {
  export enum EStatus {
    NO_STATUS = 'no_status',
    INFO = 'info',
    WARNING = 'warning',
    DANGER = 'danger',
    SUCCESS = 'success',
    IS_DONE = 'is_done',
  };  
  export type TItem = {
    label: string;
    description: string;
    status: EStatus;
    priority: number;
  };
  export type TTodo = TItem & {
    id: number;
    tg_chat_id: number;
    namespace: string;

    // NOTE: by Strapi
    createdAt: string; // 2023-11-21T08:40:01.854Z
    updatedAt: string; // 2023-11-21T08:40:01.854Z
  };
  export type TRoomState = {
    [key: string]: {
      state: TTodo[];
      tsCreate: number;
      tsUpdate: number;
    };
  };
  export type TMeta = {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  } | null
}
// --
