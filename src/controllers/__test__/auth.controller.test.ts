import request from 'supertest'
import { Request, Response, NextFunction } from 'express'
import app from '../../app'
import { StatusCodes } from 'http-status-codes'
import { authService } from '../../services'
import { Api404Error, ApiError } from '../../utils/ApiError'
import requireAuth from '../../middlewares/authHandler'

jest.mock('../../services')
jest.mock('../../middlewares/authHandler')

describe('Auth Controller', () => {
    describe('/api/v1/users/login', () => {
        it('should return an error', async () => {
            ;(authService.login as jest.Mock).mockRejectedValue(
                new ApiError(StatusCodes.UNAUTHORIZED, 'Incorrect email or password')
            )

            await request(app)
                .post('/api/v1/users/login')
                .send({ email: 'foo@bar.com', password: 'abcd1234' })
                .expect(StatusCodes.UNAUTHORIZED, {
                    code: StatusCodes.UNAUTHORIZED,
                    message: 'Incorrect email or password'
                })
        })

        it('should return a validation error', async () => {
            await request(app)
                .post('/api/v1/users/login')
                .send({ email: 'foo@bar.com' })
                .expect(StatusCodes.BAD_REQUEST, {
                    code: 400,
                    message: '"password" is required'
                })
        })

        it('should login successfully', async () => {
            ;(authService.login as jest.Mock).mockResolvedValue({
                id: 1,
                email: 'foo@bar.com',
                name: 'testing'
            })

            await request(app)
                .post('/api/v1/users/login')
                .send({ email: 'foo@bar.com', password: 'abcd1234' })
                .expect(StatusCodes.OK, {
                    user: {
                        id: 1,
                        email: 'foo@bar.com',
                        name: 'testing'
                    }
                })
        })
    })

    describe('/api/v1/users/logout', () => {
        beforeEach(() => {
            ;(requireAuth as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next())
        })

        it('should return a validation error', async () => {
            await request(app).post('/api/v1/users/logout').send({}).expect(StatusCodes.BAD_REQUEST, {
                code: 400,
                message: '"refreshToken" is required'
            })
        })

        it('should return an error', async () => {
            ;(authService.logout as jest.Mock).mockRejectedValue(new Api404Error())
            await request(app)
                .post('/api/v1/users/logout')
                .send({ refreshToken: 'abcd1234' })
                .expect(StatusCodes.NOT_FOUND, {
                    code: StatusCodes.NOT_FOUND,
                    message: 'Not found.'
                })
        })

        it('should logout successfully', async () => {
            ;(authService.logout as jest.Mock).mockResolvedValue({})
            await request(app)
                .post('/api/v1/users/logout')
                .send({ refreshToken: 'abc123' })
                .expect(StatusCodes.NO_CONTENT)
        })
    })
})
