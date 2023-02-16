import { FieldValue, getFirestore } from 'firebase-admin/firestore'

import { User } from '../models'

const usersRef = getFirestore().collection('users')

export const createUser = async (userId: string, user: User): Promise<void> => {
  await usersRef.doc(userId).create({
    ...user,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  } as Partial<User>)
}

export const getUser = async (userId: string): Promise<User | null> => {
  const snapshot = await usersRef.doc(userId).get()
  return snapshot.exists ? ({ id: snapshot.id, ...snapshot.data() } as User) : null
}

export const updateUser = async (userId: string, user: User): Promise<void> => {
  await usersRef.doc(userId).update({
    ...user,
    updatedAt: FieldValue.serverTimestamp()
  } as Partial<User>)
}

export const deleteUser = async (userId: string): Promise<void> => {
  await usersRef.doc(userId).delete()
}
