import { Prisma, User } from '@prisma/client'
import prisma from '../config/prismaClient'
import { ApiError } from '../utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { encryptPassword } from '../utils/encrypt'

const getUserByEmail = async (email: string): Promise<User | null> => {
    return prisma.user.findUnique({ where: { email } }) as Promise<User | null>
}

const getUserById = async (id: number): Promise<User | null> => {
    return prisma.user.findUnique({ where: { id } }) as Promise<User | null>
}

const createUser = async (email: string, password: string, name?: string): Promise<User> => {
    const existingUser = await getUserByEmail(email)
    if (existingUser) throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already taken')

    return prisma.user.create({
        data: {
            name,
            email,
            password: await encryptPassword(password)
        }
    })
}

const updateUserById = async (userId: number, updateBody: Prisma.UserUpdateInput): Promise<User | null> => {
    const user = await getUserById(userId)
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    const { password, email } = updateBody

    if (email && user.email !== email && (await getUserByEmail(email as string))) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already taken')
    }

    if (password) {
        updateBody.password = await encryptPassword(password as string)
    }

    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: updateBody
    })

    return updatedUser
}

const deleteUserById = async (userId: number): Promise<User | null> => {
    const user = await getUserById(userId)
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    await prisma.user.delete({ where: { id: user.id } })
    return user
}

export default {
    createUser,
    updateUserById,
    deleteUserById,
    getUserById,
    getUserByEmail
}
