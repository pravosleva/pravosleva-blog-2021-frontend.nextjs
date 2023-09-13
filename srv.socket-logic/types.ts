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
  }
  
  export enum EServerIncoming {
    // 1.incoming
    CLIENT_CONNECT_TO_ROOM = 'c:gonna-be-connected-to-room',

    // 2.incoming
    AUDITLIST_REPLACE = 'c:auditlist.replace', // NOTE: Full update
    AUDIT_ADD = 'c:audit.add',
    AUDIT_REMOVE = 'c:audit.remove',
  
    JOB_ADD = 'c:job.add',
    JOB_UPDATE = 'c:job.update',
    JOB_REMOVE = 'c:job.remove',
    JOB_TOGGLE_DONE = 'c:job.toggle-done',
  
    SUBJOB_ADD = 'c:subjob.add',
    SUBJOB_UPDATE = 'c:subjob.update',
    SUBJOB_REMOVE = 'c:subjob.remove',
    SUBJOB_TOGGLE_DONE = 'c:subjob.toggle-done',
  }
}

export namespace NEventData {
  export namespace NServerIncoming {
    export type TCLIENT_CONNECT_TO_ROOM = {
      room: number;
    }
    export type TCLIENT_CONNECT_TO_ROOM_CB = ({ data }: { data: { room: number; audits: TAudit[]; message?: string } }) => void;

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

    export type TJOB_ADD = { room: number; auditId: string; name: string; subjobs: TSubJob[]; }
    export type TSUBJOB_ADD = { room: number; auditId: string; name: string; jobId: string; }
    export type TJOB_TOGGLE_DONE = { room: number; auditId: string; jobId: string; }
    export type TJOB_REMOVE = { room: number; auditId: string; jobId: string; }
    export type TSUBJOB_TOGGLE_DONE = { room: number; auditId: string; jobId: string; subjobId: string; }
    export type TAUDIT_ADD = { room: number; name: string; description: string; jobs: { name: string; subjobs: { name: string }[] }[] }
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
