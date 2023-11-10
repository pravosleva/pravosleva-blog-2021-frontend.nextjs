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

export namespace NEvent {
  export enum EServerOutgoing {
    // AUDITLIST_STATE = 's:auditlist.state', // NOTE: Init state when user connected
    AUDITLIST_REPLACE = 's:auditlist.replace', // NOTE: Full update
    AUDIT_ADD = 's:audit.add',
    // AUDIT_REMOVE = 's:audit.remove',
    // JOB_ADD = 's:job.add',
    // JOB_UPDATE = 's:job.update',
    // JOB_REMOVE = 's:job.remove',
    // SUBJOB_ADD = 's:subjob.add',
    // SUBJOB_UPDATE = 's:subjob.update',
    // SUBJOB_REMOVE = 's:subjob.remove',

    // NOTE: New 2023.11
    TODO2023_REPLACE_ROOM_STATE = 's:todo-2023:replace-room-state',
  }
  
  export enum EServerIncoming {
    // 1.incoming
    CLIENT_CONNECT_TO_ROOM = 'c:gonna-be-connected-to-room',
    // 2.incoming
    AUDITLIST_REPLACE = 'c:auditlist.replace', // NOTE: Full update
    AUDIT_ADD = 'c:audit.add',
    AUDIT_REMOVE = 'c:audit.remove',
    AUDIT_UPDATE_COMMENT = 'c:audit.update-comment',
    JOB_ADD = 'c:job.add',
    JOB_UPDATE = 'c:job.update',
    JOB_REMOVE = 'c:job.remove',
    JOB_TOGGLE_DONE = 'c:job.toggle-done',
    SUBJOB_ADD = 'c:subjob.add',
    SUBJOB_UPDATE = 'c:subjob.update',
    SUBJOB_REMOVE = 'c:subjob.remove',
    SUBJOB_TOGGLE_DONE = 'c:subjob.toggle-done',

    TODO2023_ADD_NAMESPACE = 'c:todo-2023:add-namespace',
    TODO2023_REMOVE_NAMESPACE = 'c:todo-2023:remove-namespace',
    TODO2023_ADD_TODO_ITEM = 'c:todo-2023:add-todo-item',
    TODO2023_REMOVE_TODO_ITEM = 'c:todo-2023:remove-todo-item',
    TODO2023_UPDATE_TODO_ITEM = 'c:todo-2023:update-todo-item',
  }
}

export namespace NEventData {
  export namespace NServerIncoming {
    export type TCLIENT_CONNECT_TO_ROOM = {
      room: number;
    }
    export type TCLIENT_CONNECT_TO_ROOM_CB = ({ data }: {
      data: {
        room: number;
        audits: TAudit[]; message?: string;
        roomState: NTodo.TRoomState | undefined;
      };
    }) => void;

    export type TAUDITLIST_REPLACE = {
      room: number;
      audits: TAudit[];
    }
    export type TAUDITLIST_REPLACE_CB = ({ data }: { data: { room: number; audits: TAudit[]; message?: string } }) => void;

    export type TAUDIT_REMOVE = {
      room: number;
      auditId: string;
    }
    export type TAUDIT_REMOVE_CB_ARG = { data: { room: number; isOk: boolean; audits?: TAudit[]; message?: string } }
    export type TAUDIT_REMOVE_CB = ({ data }: TAUDIT_REMOVE_CB_ARG) => void;

    export type TAUDIT_UPDATE_COMMENT = { room: number; auditId: string; comment: string }
    export type TAUDIT_UPDATE_COMMENT_CB_ARG = { data: { room: number; isOk: boolean; audits?: TAudit[]; message?: string } }
    export type TAUDIT_UPDATE_COMMENT_CB = ({ data }: TAUDIT_UPDATE_COMMENT_CB_ARG) => void;

    export type TJOB_ADD = { room: number; auditId: string; name: string; subjobs: TSubJob[]; }
    export type TSUBJOB_ADD = { room: number; auditId: string; name: string; jobId: string; }
    export type TJOB_TOGGLE_DONE = { room: number; auditId: string; jobId: string; }
    export type TJOB_REMOVE = { room: number; auditId: string; jobId: string; }
    export type TSUBJOB_TOGGLE_DONE = { room: number; auditId: string; jobId: string; subjobId: string; }
    export type TAUDIT_ADD = { room: number; name: string; description: string; jobs: { name: string; subjobs: { name: string }[] }[] }

    // NOTE: New 2023.11
    export type TAddNamespace = {
      room: number;
      name: string;
    };
    export type TAddNamespaceCB = {
      isOk: boolean;
      message?: string;
      room: number;
      roomState: NTodo.TRoomState;
    };
    export type TRemoveNamespace = {
      room: number;
      name: string;
    };
    export type TRemoveNamespaceCB = {
      isOk: boolean;
      message?: string;
      room: number;
      roomState: NTodo.TRoomState;
    };
    export type TAddTodo = {
      todoItem: NTodo.TItem;
      room: number;
      namespace: string;
    };
    export type TAddTodoCB = {
      isOk: boolean;
      message?: string;
      room: number;
      roomState: NTodo.TRoomState;
    };
    export type TRemoveTodo = {
      room: number;
      namespace: string;
      todoId: number;
    };
    export type TRemoveTodoCB = {
      isOk: boolean;
      message?: string;
      room: number;
      roomState: NTodo.TRoomState;
    };
    export type TUpdateTodo = {
      room: number;
      namespace: string;
      todoId: number;
      newTodoItem: NTodo.TItem;
    };
    export type TUpdateTodoCB = {
      isOk: boolean;
      message?: string;
      room: number;
      roomState: NTodo.TRoomState;
    };
  }
}

export namespace NAudit {
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
  
    tsCreate: number;
    tsUpdate: number;
  }
}

// -- NOTE: New 2023.11 (server 2/2)
export namespace NTodo {
  export enum EStatus {
    NO_STATUS = 'no-status',
    INFO = 'info',
    WARNING = 'warning',
    DANGER = 'danger',
    SUCCESS = 'success',
    IS_DONE = 'is-done',
  };  
  export type TItem = {
    label: string;
    descr: string;
    status: EStatus;
    priority: number;
  };
  export type TTodo = TItem & { id: number; };
  export type TRoomState = {
    [key: string]: {
      state: TTodo[];
      tsCreate: number;
      tsUpdate: number;
    };
  };
}
// --
