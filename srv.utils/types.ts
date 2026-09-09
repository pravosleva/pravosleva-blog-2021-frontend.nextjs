// import { Request as IRequest, Response as IResponse } from 'express'
import { Server } from 'socket.io'
import { slugMapCacheInstance, TLocalSlugMap } from '~/srv.utils/cahce/slug-map/slugMap.cahe'

declare global {
  namespace Express {
    interface Request {
      io: Server;
      slugMapCacheInstance?: typeof slugMapCacheInstance;
      slugMap?: TLocalSlugMap;
    }
    interface Response {
      startTime: (tag: string, msg: string) => void;
      endTime: (tag: string) => void;
    }
  }
}