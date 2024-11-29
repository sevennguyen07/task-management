import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import userService from '../services/user.service'
import config from '../config/config'
import { ApiError } from '../utils/ApiError'

interface IJwtPayload extends JwtPayload {
    id: number
}

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authenticationToken = req.headers['authorization']
    if (authenticationToken) {
        const secret = config.jwt.secret
        try {
            const token = jwt.verify(authenticationToken.replace('Bearer ', ''), secret) as IJwtPayload
            console.log('authenticationToken=', token)
            const user = await userService.getUserById(token.id)

            if (user) {
                req.context.user = user
                next()
            } else {
                next(new ApiError(StatusCodes.UNAUTHORIZED, 'Wrong authentication token'))
            }
        } catch (error) {
            next(new ApiError(StatusCodes.UNAUTHORIZED, 'Wrong authentication token'))
        }
    } else {
        next(new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication token missing'))
    }
}

export default requireAuth
