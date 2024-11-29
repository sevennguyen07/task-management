import { Task, User } from '@prisma/client'

export interface TToken {
    token: string
    expires: Date
}

export interface TAuthTokens {
    access: TToken
    refresh?: TToken
}

export type TUserKey = keyof User
export type TUserID = User['id']
export type TUserRead = Pick<User, TUserKey> | null
export type TUserCreate = Pick<User, 'name' | 'email' | 'password'>
export type TUserLogin = Pick<User, 'email' | 'password'>

export type TTaskID = Task['id']
export type TTaskQuery = Pick<Task, 'id' | 'ownerId'>
export type TTaskCreate = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
