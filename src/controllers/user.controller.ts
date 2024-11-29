import _omit from 'lodash/omit'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { User } from '@prisma/client'
import userService from '../services/user.service'

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name } = req.body
        const user = await userService.createUser({ email, password, name })

        res.status(StatusCodes.CREATED).send(_omit(user, 'password'))
    } catch (error) {
        next(error)
    }
}

const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loggedUser = req.context.user as User
        const user = await userService.getUserById(loggedUser.id)
        res.send(user)
    } catch (error) {
        next(error)
    }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loggedUser = req.context.user as User
        const user = await userService.updateUserById(loggedUser.id, req.body)
        res.send(user)
    } catch (error) {
        next(error)
    }
}

const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loggedUser = req.context.user as User
        await userService.deleteUserById(loggedUser.id)
        res.status(StatusCodes.NO_CONTENT).send()
    } catch (error) {
        next(error)
    }
}

export default {
    create,
    get,
    update,
    remove
}
