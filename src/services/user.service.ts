import { Prisma, User } from '@prisma/client'
import prisma from '../config/prismaClient'
import { Api404Error, ApiError } from '../utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { encryptPassword } from '../utils/encrypt'
import { TUserCreate, TUserID, TUserKey, TUserRead } from '../types/types'

const getUserByEmail = async (email: string, keys?: TUserKey[]): Promise<TUserRead> => {
    const selectedKeys = keys || ['id', 'email', 'name']
    const user = await prisma.user.findUnique({
        where: { email },
        select: selectedKeys.reduce((acc, curr) => ({ ...acc, [curr]: true }), {})
    })

    return user as TUserRead
}

const getUserById = async (id: TUserID, keys?: TUserKey[]): Promise<TUserRead> => {
    const selectedKeys = keys || ['id', 'email', 'name']
    const user = await prisma.user.findUnique({
        where: { id },
        select: selectedKeys.reduce((acc, curr) => ({ ...acc, [curr]: true }), {})
    })

    return user as TUserRead
}

const createUser = async (user: TUserCreate): Promise<User> => {
    const { name, email, password } = user
    const existingUser = await getUserByEmail(email, ['email'])
    if (existingUser) throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already taken')

    return prisma.user.create({
        data: {
            name,
            email,
            password: await encryptPassword(password)
        }
    })
}

const updateUserById = async (
    userId: TUserID,
    updateBody: Prisma.UserUpdateInput,
    keys?: TUserKey[]
): Promise<TUserRead> => {
    const user = await getUserById(userId)
    if (!user) {
        throw new Api404Error()
    }
    const { password, email } = updateBody

    if (email && user.email !== email && (await getUserByEmail(email as string))) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already taken')
    }

    if (password) {
        updateBody.password = await encryptPassword(password as string)
    }

    const selectedKeys = keys || ['id', 'email', 'name']
    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: updateBody,
        select: selectedKeys.reduce((acc, curr) => ({ ...acc, [curr]: true }), {})
    })

    return updatedUser as TUserRead
}

const deleteUserById = async (userId: TUserID): Promise<void> => {
    const user = await getUserById(userId)
    if (!user) {
        throw new Api404Error()
    }

    await prisma.user.delete({ where: { id: user.id } })
}

export default {
    createUser,
    updateUserById,
    deleteUserById,
    getUserById,
    getUserByEmail
}
