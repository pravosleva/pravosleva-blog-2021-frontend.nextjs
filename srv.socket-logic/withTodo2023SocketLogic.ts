import { Socket } from 'socket.io'
import { getTstValue } from '~/srv.utils'

console.log('-- wip: ./srv.scoket-logic')
console.log(getTstValue(1))
console.log('--')

// Fake DB
// interface IConnectionData {
//   ip: string
// }
// const stateMap = new Map<string, IConnectionData>() // NOTE: key - socketId

export const withTodo2023SocketLogic = (io: Socket) => {
  io.on('connection', function (socket: any) {
    console.log('SERVER: Connected...')

    io.to(socket.id).emit('tst.action1', {
      data: {
        socketId: socket.id,
      }
    })
  })
}
