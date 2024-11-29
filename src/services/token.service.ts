import { TAuthTokens } from './../types/types'
import jwt from 'jsonwebtoken'
import { Token, TokenType } from '@prisma/client'
import moment, { Moment } from 'moment'
import config from '../config/config'
import prisma from '../config/prismaClient'

const createToken = async (
    userId: number,
    expires: Moment,
    type: TokenType,
    secret = config.jwt.secret
): Promise<string> => {
    const payload = {
        id: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type
    }

    const token = jwt.sign(payload, secret)
    await prisma.token.deleteMany({ where: { userId, type } })
    await prisma.token.create({
        data: {
            userId,
            token,
            type,
            expires: expires.toDate(),
            blacklisted: false
        }
    })

    return token
}

const generateAuthTokens = async (userId: number): Promise<TAuthTokens> => {
    const accessTokenExpires = moment().add(config.jwt.accessExpirationInMinutes, 'minutes')
    const accessToken = await createToken(userId, accessTokenExpires, TokenType.ACCESS)

    const refreshTokenExpires = moment().add(config.jwt.refrestExpirationInDays, 'days')
    const refreshToken = await createToken(userId, refreshTokenExpires, TokenType.REFRESH)

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate()
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate()
        }
    }
}

export default {
    createToken,
    generateAuthTokens
}
