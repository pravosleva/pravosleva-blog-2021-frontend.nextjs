import { Request as IRequest } from 'express'
import { Socket } from 'socket.io'

export type TEnhancedRequest = IRequest & {
  startTime: (tag: string, msg: string) => void;
  endTime: (tag: string) => void;

  io: Socket;
}
