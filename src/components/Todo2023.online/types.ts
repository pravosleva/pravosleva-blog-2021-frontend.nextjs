import { TAudit } from "../ToDo2023.offline/state/types";

export namespace NEvent {
  export enum EServerOutgoing {
    // AUDITLIST_STATE = 's:auditlist.state', 

    AUDIT_ADD = 's:audit.add',
    AUDITLIST_REPLACE = 's:auditlist.replace',// 2. YES // NOTE: Full update 
    // AUDIT_REMOVE = 's:audit.remove',
  
    // JOB_ADD = 's:job.add',
    // JOB_UPDATE = 's:job.update',
    // JOB_REMOVE = 's:job.remove',
  
    // SUBJOB_ADD = 's:subjob.add',
    // SUBJOB_UPDATE = 's:subjob.update',
    // SUBJOB_REMOVE = 's:subjob.remove',
  }
  
  export enum EServerIncoming {
    CLIENT_CONNECT_TO_ROOM = 'c:gonna-be-connected-to-room', // 1. YES // NOTE: -> Init state when user connected
    AUDITLIST_REPLACE = 'c:auditlist.replace', // 2. YES // NOTE: Full update

    AUDIT_ADD = 'c:audit.add',
    AUDIT_REMOVE = 'c:audit.remove', // 3. YES
    AUDIT_UPDATE_COMMENT = 'c:audit.update-comment',
  
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
    // 1.incoming
    export type TCLIENT_CONNECT_TO_ROOM = {
      room: number;
    }
    export type TCLIENT_CONNECT_TO_ROOM_CB_ARG = { data: { room: number; audits: TAudit[] } }
    export type TCLIENT_CONNECT_TO_ROOM_CB = ({ data }: TCLIENT_CONNECT_TO_ROOM_CB_ARG) => void;
    // 2.incoming
    export type TAUDITLIST_REPLACE = {
      room: number;
      audits: TAudit[];
    }
    export type TAUDITLIST_REPLACE_CB_ARG = { data: { room: number; audits: TAudit[] } }
    export type TAUDITLIST_REPLACE_CB = ({ data }: TAUDITLIST_REPLACE_CB_ARG) => void;
    // 3.
    export type TAUDIT_REMOVE = {
      room: number;
      audits: TAudit[];
    }
    export type TAUDIT_REMOVE_CB_ARG = { data: { room: number; audits: TAudit[] } }
    export type TAUDIT_REMOVE_CB = ({ data }: TAUDIT_REMOVE_CB_ARG) => void;

    export type TAUDIT_UPDATE_COMMENT_CB_ARG = { data: { room: number; auditId: string; comments: string } }
    export type TAUDIT_UPDATE_COMMENT_CB = ({ data }: TAUDIT_UPDATE_COMMENT_CB_ARG) => void;
  }
  export namespace NServerOutgoing {
    export type TAUDITLIST_REPLACE = { audits: TAudit[]; }
  }
}
