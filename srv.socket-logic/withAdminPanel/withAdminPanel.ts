import { instrument } from '@socket.io/admin-ui'
import { Server } from 'socket.io'

export const withAdminPanel = (io: Server) => {
  instrument(io, {
    namespaceName: '/admin',
    // auth: false,
    auth: {
      type: "basic",
      username: "admin",
      password: "$2b$10$heqvAkYMez.Va6Et2uXInOnkCT6/uQj1brkrbyG3LpopDklcq7ZOS", // "changeit" encrypted with bcrypt
    },
  })
}
