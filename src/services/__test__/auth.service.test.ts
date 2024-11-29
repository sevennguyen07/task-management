import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../../utils/ApiError'
import userService from '../user.service'
import { isPasswordMatch } from '../../utils/encrypt'
import prisma from '../../config/prismaClient'
import authService from '../auth.service'

jest.mock('../user.service')
jest.mock('../../utils/encrypt')
jest.mock('../../config/prismaClient', () => ({
    token: {
        findFirst: jest.fn(),
        deleteMany: jest.fn()
    }
}))

describe('Auth Service', () => {
    describe('login', () => {
        it('should throw an error if user does not exist', async () => {
            const mockUser = { email: 'test@example.com', password: 'password123' }
            ;(userService.getUserByEmail as jest.Mock).mockResolvedValue(null)

            await expect(authService.login(mockUser)).rejects.toThrow(
                new ApiError(StatusCodes.UNAUTHORIZED, 'Incorrect email or password')
            )
        })

        it('should throw an error if password does not match', async () => {
            const mockUser = { email: 'test@example.com', password: 'password123' }
            const existingUser = { id: 1, email: 'test@example.com', password: 'hashedPassword' }
            ;(userService.getUserByEmail as jest.Mock).mockResolvedValue(existingUser)
            ;(isPasswordMatch as jest.Mock).mockResolvedValue(false)

            await expect(authService.login(mockUser)).rejects.toThrow(
                new ApiError(StatusCodes.UNAUTHORIZED, 'Incorrect email or password')
            )
        })

        it('should return the user if login is successful', async () => {
            const mockUser = { email: 'test@example.com', password: 'password123' }
            const existingUser = { id: 1, email: 'test@example.com', password: 'hashedPassword' }

            ;(userService.getUserByEmail as jest.Mock).mockResolvedValue(existingUser)
            ;(isPasswordMatch as jest.Mock).mockResolvedValue(true)

            const result = await authService.login(mockUser)

            expect(result).toEqual(existingUser)
            expect(userService.getUserByEmail).toHaveBeenCalledWith(mockUser.email, ['id', 'email', 'password'])
            expect(isPasswordMatch).toHaveBeenCalledWith(mockUser.password, existingUser.password)
        })
    })

    describe('logout', () => {
        it('should throw an error if refresh token is not found', async () => {
            const mockRefreshToken = 'refreshToken123'
            ;(prisma.token.findFirst as jest.Mock).mockResolvedValue(null)

            await expect(authService.logout(mockRefreshToken)).rejects.toThrowError(
                new ApiError(StatusCodes.NOT_FOUND, 'Not found')
            )
        })

        it('should delete all tokens associated with the user if refresh token is found', async () => {
            const mockRefreshToken = 'refreshToken123'
            const mockTokenData = { userId: 1, token: mockRefreshToken }

            ;(prisma.token.findFirst as jest.Mock).mockResolvedValue(mockTokenData)
            ;(prisma.token.deleteMany as jest.Mock).mockResolvedValue({ count: 1 })

            await authService.logout(mockRefreshToken)
            expect(prisma.token.deleteMany).toHaveBeenCalledWith({ where: { userId: mockTokenData.userId } })
        })
    })
})
