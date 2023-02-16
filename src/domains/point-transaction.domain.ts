import { FieldValue } from 'firebase-admin/firestore'

import { User } from '~/types/models'
import { usersRef } from '~/types/users'
import { db } from '~/utils/firebase'

export const addUserPoint = async (userId: string, point: number): Promise<void> => {
  await db.runTransaction(async (t) => {
    const userRef = usersRef.doc(userId)
    const snapshot = await t.get(userRef)
    if (!snapshot.exists) {
      throw new Error('user is not found.')
    }
    const user = { id: snapshot.id, ...snapshot.data() } as User

    t.update(userRef, {
      point: user.point + point,
      updatedAt: FieldValue.serverTimestamp()
    } as Partial<User>)
  })
}

export const minusUserPoint = async (userId: string, point: number): Promise<void> => {
  await db.runTransaction(async (t) => {
    const userRef = usersRef.doc(userId)
    const snapshot = await t.get(userRef)
    if (!snapshot.exists) {
      throw new Error('user is not found.')
    }
    const user = { id: snapshot.id, ...snapshot.data() } as User

    if (user.point - point <= 0) {
      throw new Error('ポイントがありません。')
    }

    t.update(userRef, {
      point: user.point - point,
      updatedAt: FieldValue.serverTimestamp()
    } as Partial<User>)
  })
}
