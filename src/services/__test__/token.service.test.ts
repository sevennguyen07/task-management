import { TokenType } from '@prisma/client'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import prisma from '../../config/prismaClient'
import tokenService from '../token.service'
import config from '../../config/config'

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn()
}))

jest.mock('../../config/prismaClient', () => ({
    token: {
        create: jest.fn(),
        deleteMany: jest.fn()
    }
}))

jest.mock('../../config/config', () => ({
    jwt: {
        secret: 'test-secret',
        accessExpirationInMinutes: 15,
        refrestExpirationInDays: 7
    }
}))

describe('Token Service', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should generate a token and store it in the database', async () => {
        const userId = 1
        const expires = moment().add(15, 'minutes')
        const type = TokenType.ACCESS
        const token = 'generated-jwt-token'

        ;(jwt.sign as jest.Mock).mockReturnValue(token)
        ;(prisma.token.deleteMany as jest.Mock).mockResolvedValue({ count: 1 })
        ;(prisma.token.create as jest.Mock).mockResolvedValue({
            userId,
            token,
            type,
            expires: expires.toDate(),
            blacklisted: false
        })

        const generatedToken = await tokenService.createToken(userId, expires, type)

        expect(generatedToken).toBe(token)
        expect(jwt.sign).toHaveBeenCalledWith(
            {
                id: userId,
                iat: expect.any(Number),
                exp: expires.unix(),
                type
            },
            'test-secret'
        )
        expect(prisma.token.deleteMany).toHaveBeenCalledWith({ where: { userId, type } })
        expect(prisma.token.create).toHaveBeenCalledWith({
            data: {
                userId,
                token,
                type,
                expires: expires.toDate(),
                blacklisted: false
            }
        })
    })
})
