import { Prisma, User } from '@prisma/client'
import { userService } from '../../services'
import prisma from '../../config/prismaClient'
import { Api404Error, ApiError } from '../../utils/ApiError'
import { encryptPassword } from '../../utils/encrypt'
import { StatusCodes } from 'http-status-codes'

jest.mock('../../utils/encrypt')
jest.mock('../../utils/ApiError')
jest.mock('../../config/prismaClient', () => ({
    user: {
        findUnique: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
        create: jest.fn()
    }
}))
describe('User Service', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('getUserByEmail', () => {
        it('should return user by email', async () => {
            const mockUser = { id: 1, email: 'test@example.com', name: 'John Doe' }
            ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

            const result = await userService.getUserByEmail('test@example.com')
            expect(result).toEqual(mockUser)
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { email: 'test@example.com' },
                select: { id: true, email: true, name: true }
            })
        })

        it('should return user with custom keys', async () => {
            const mockUser = { id: 1, email: 'test@example.com', name: 'John Doe', createdAt: '2021-01-01' }
            ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

            const result = await userService.getUserByEmail('test@example.com', ['id', 'email', 'createdAt'])
            expect(result).toEqual(mockUser)
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { email: 'test@example.com' },
                select: { id: true, email: true, createdAt: true }
            })
        })
    })

    describe('getUserById', () => {
        it('should return user by ID', async () => {
            const mockUser = { id: 1, email: 'test@example.com', name: 'John Doe' }
            ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

            const result = await userService.getUserById(1)
            expect(result).toEqual(mockUser)
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                select: { id: true, email: true, name: true }
            })
        })
    })

    describe('createUser', () => {
        it('should create a new user successfully', async () => {
            const mockUser = { name: 'John Doe', email: 'test@example.com', password: 'password123' }
            const mockEncryptedPassword = 'encryptedPassword'
            const createdUser = { id: 1, ...mockUser, password: mockEncryptedPassword }

            ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
            ;(encryptPassword as jest.Mock).mockResolvedValue(mockEncryptedPassword)
            ;(prisma.user.create as jest.Mock).mockResolvedValue(createdUser)

            const result = await userService.createUser(mockUser)
            expect(result).toEqual(createdUser)
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { email: 'test@example.com' },
                select: { email: true }
            })
            expect(encryptPassword).toHaveBeenCalledWith('password123')
            expect(prisma.user.create).toHaveBeenCalledWith({
                data: {
                    name: 'John Doe',
                    email: 'test@example.com',
                    password: mockEncryptedPassword
                }
            })
        })
    })

    describe('updateUserById', () => {
        it('should update user by ID', async () => {
            const mockUser = { id: 1, name: 'John Doe' }
            const updateData = { name: 'Seven' }
            const updatedUser = { ...mockUser, ...updateData }

            ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
            ;(prisma.user.update as jest.Mock).mockResolvedValue(updatedUser)

            const result = await userService.updateUserById(1, updateData)
            expect(result).toEqual(updatedUser)
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                select: { id: true, email: true, name: true }
            })
            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: updateData,
                select: { id: true, email: true, name: true }
            })
        })

        it('should throw an error if the user does not exist', async () => {
            ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
            try {
                await userService.updateUserById(1, { email: 'newemail@example.com' })
            } catch (error) {
                expect(error).toBeInstanceOf(Api404Error)
            }
        })

        it('should throw an error if email is already taken', async () => {
            const mockUser = { id: 1, email: 'test@example.com', name: 'John Doe' }
            const updateData = { email: 'newemail@example.com' }

            ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
            ;(prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser) // Mimicking an existing user with the new email

            try {
                await userService.updateUserById(1, updateData)
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError)
            }
        })
    })

    describe('deleteUserById', () => {
        it('should delete user by ID', async () => {
            const mockUser = { id: 1, email: 'test@example.com', name: 'John Doe' }

            ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
            ;(prisma.user.delete as jest.Mock).mockResolvedValue(mockUser)

            await userService.deleteUserById(1)

            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                select: { id: true, email: true, name: true }
            })
            expect(prisma.user.delete).toHaveBeenCalledWith({
                where: { id: 1 }
            })
        })

        it('should throw an error if the user does not exist', async () => {
            ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
            try {
                await userService.deleteUserById(1)
            } catch (error) {
                expect(error).toBeInstanceOf(Api404Error)
            }
        })
    })
})
