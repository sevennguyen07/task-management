import _omit from 'lodash/omit'
import { TokenType, User } from '@prisma/client'
import { ApiError } from '../utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { isPasswordMatch } from '../utils/encrypt'
import userService from './user.service'
import prisma from '../config/prismaClient'

const login = async (email: string, password: string): Promise<Omit<User, 'password'>> => {
    const existingUser = await userService.getUserByEmail(email)
    if (!existingUser || !(await isPasswordMatch(password, existingUser.password))) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Incorrect email or password')
    }

    return _omit(existingUser, 'password')
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
