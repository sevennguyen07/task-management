import request from 'supertest'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import app from '../../app'
import { userService } from '../../services'
import { Api404Error } from '../../utils/ApiError'
import requireAuth from '../../middlewares/authHandler'

jest.mock('../../services')
jest.mock('../../middlewares/authHandler')

describe('User Controller', () => {
    describe('POST /v1/users (create)', () => {
        it('should create a new user and return user data without password', async () => {
            const newUser = { email: 'test@example.com', password: 'password123', name: 'Test User' }
            const createdUser = { id: 1, ...newUser }

            ;(userService.createUser as jest.Mock).mockResolvedValue(createdUser)

            const response = await request(app).post('/v1/users').send(newUser)
            expect(response.status).toBe(StatusCodes.CREATED)
            expect(response.body).toEqual({ id: 1, email: 'test@example.com', name: 'Test User' })
            expect(userService.createUser).toHaveBeenCalledWith(newUser)
        })

        it('should handle errors and pass them to next()', async () => {
            const newUser = { email: 'test@example.com', password: 'password123', name: 'Test User' }
            const error = new Api404Error()

            ;(userService.createUser as jest.Mock).mockRejectedValue(error)

            const response = await request(app).post('/v1/users').send(newUser)
            expect(response.status).toBe(StatusCodes.NOT_FOUND)
        })

        it('should return a validation error', async () => {
            const newUser = { email: 'test@example.com' }
            await request(app).post('/v1/users').send(newUser).expect(StatusCodes.BAD_REQUEST, {
                code: StatusCodes.BAD_REQUEST,
                message: '"password" is required'
            })
        })
    })

    describe('GET /v1/users/me', () => {
        beforeEach(() => {
            ;(requireAuth as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => {
                req.context.user = { id: 1 }
                next()
            })
        })

        it('should return user details', async () => {
            const user = { id: 1, email: 'test@example.com', name: 'Test User' }
            ;(userService.getUserById as jest.Mock).mockResolvedValue(user)

            const response = await request(app).get('/v1/users/me')
            expect(response.status).toBe(StatusCodes.OK)
            expect(response.body).toEqual(user)
            expect(userService.getUserById).toHaveBeenCalledWith(1)
        })

        it('should handle errors and pass them to next()', async () => {
            const error = new Api404Error()
            ;(userService.getUserById as jest.Mock).mockRejectedValue(error)

            const response = await request(app).get('/v1/users/me')
            expect(response.status).toBe(StatusCodes.NOT_FOUND)
            expect(userService.getUserById).toHaveBeenCalledWith(1)
        })
    })

    describe('PATCH /v1/users/me', () => {
        beforeEach(() => {
            ;(requireAuth as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => {
                req.context.user = { id: 1 }
                next()
            })
        })
        it('should update user details and return updated user', async () => {
            const updatedUserData = { name: 'Updated Name' }
            const updatedUser = { id: 1, email: 'test@example.com', name: 'Updated Name' }

            ;(userService.updateUserById as jest.Mock).mockResolvedValue(updatedUser)
            const response = await request(app).patch('/v1/users/me').send(updatedUserData)

            expect(response.status).toBe(StatusCodes.OK)
            expect(response.body).toEqual(updatedUser)
            expect(userService.updateUserById).toHaveBeenCalledWith(1, updatedUserData)
        })

        it('should handle errors and pass them to next()', async () => {
            const updatedUserData = { name: 'Updated Name' }
            const error = new Api404Error()
            ;(userService.updateUserById as jest.Mock).mockRejectedValue(error)

            const response = await request(app).patch('/v1/users/me').send(updatedUserData)

            expect(response.status).toBe(StatusCodes.NOT_FOUND)
            expect(userService.updateUserById).toHaveBeenCalledWith(1, updatedUserData)
        })
    })

    describe('DELETE /v1/users/me (remove)', () => {
        beforeEach(() => {
            ;(requireAuth as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => {
                req.context.user = { id: 1 }
                next()
            })
        })

        it('should delete the user and return no content', async () => {
            ;(userService.deleteUserById as jest.Mock).mockResolvedValue(null)

            const response = await request(app).delete('/v1/users/me').set('Authorization', 'Bearer validtoken')
            expect(response.status).toBe(StatusCodes.NO_CONTENT)
            expect(userService.deleteUserById).toHaveBeenCalledWith(1)
        })

        it('should handle errors and pass them to next()', async () => {
            const error = new Api404Error()
            ;(userService.deleteUserById as jest.Mock).mockRejectedValue(error)

            const response = await request(app).delete('/v1/users/me').set('Authorization', 'Bearer validtoken')
            expect(response.status).toBe(StatusCodes.NOT_FOUND)
            expect(userService.deleteUserById).toHaveBeenCalledWith(1)
        })
    })
})
