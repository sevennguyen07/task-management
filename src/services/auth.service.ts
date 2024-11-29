import { TokenType, User } from '@prisma/client'
import { ApiError } from '../utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { isPasswordMatch } from '../utils/encrypt'
import userService from './user.service'
import prisma from '../config/prismaClient'
import { TUserLogin, TUserRead } from '../types/types'

const login = async (user: TUserLogin): Promise<TUserRead> => {
    const existingUser = await userService.getUserByEmail(user.email, ['id', 'email', 'password'])
    if (!existingUser || !(await isPasswordMatch(user.password, existingUser.password))) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Incorrect email or password')
    }

    return existingUser
}

const logout = async (refreshToken: string): Promise<void> => {
    const refreshTokenData = await prisma.token.findFirst({
        where: {
            token: refreshToken,
            type: TokenType.REFRESH
        }
    })

    if (!refreshTokenData) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Not found')
    }

    await prisma.token.deleteMany({ where: { userId: refreshTokenData.userId } })
}

export default {
    login,
    logout
}
