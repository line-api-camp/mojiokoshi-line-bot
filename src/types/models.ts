import { Timestamp } from 'firebase-admin/firestore'

interface Base {
  id: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface User extends Base {
  point: number
}
