import { Timestamp } from 'firebase-admin/firestore'

interface Base {
  id?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface User extends Base {
  point: number
  stripeCustomerId: string
}

export const getInitUserData = (): User => {
  return {
    point: 0,
    stripeCustomerId: ''
  }
}
