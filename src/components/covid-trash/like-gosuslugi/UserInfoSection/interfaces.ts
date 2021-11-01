export type TUserData = {
  confirmed: boolean
    blocked: boolean
    _id: string
    username: string
    email: string
    fullName: string
    passportSN: number
    dateOfBirth: string // NOTE: Если создано из админки, прилетит именно в таком формате "1986-04-13"
    provider: string
    createdAt: string // ISO
    updatedAt: string // ISO
    __v: number
    role: {
      _id: string
      name: string
      description: string
      type: string
      createdAt: string // ISO
      updatedAt: string // ISO
      __v: number
      id: string
    },
    id: string
}