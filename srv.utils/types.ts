import { Request as IRequest, Response as IResponse } from 'express'
import { Socket } from 'socket.io'

export type TEnhancedResponse = IResponse & {
  startTime: (tag: string, msg: string) => void;
  endTime: (tag: string) => void;
}

export type TEnhancedRequest = IRequest & {
  io: Socket;
}