import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import _omit from 'lodash/omit'
import { authService, tokenService } from '../services'

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body
        const user = await authService.login(email, password)

        const accessToken = await tokenService.generateAuthTokens(user.id)
        res.send({ user, tokens: accessToken })
    } catch (error) {
        next(error)
    }
}

const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await authService.logout(req.body.refreshToken)
        res.status(StatusCodes.NO_CONTENT).send()
    } catch (error) {
        next(error)
    }
}

export default {
    login,
    logout
}
