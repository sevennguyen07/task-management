import { Request, Response, NextFunction } from 'express'
import userService from '../services/user.service'
import { StatusCodes } from 'http-status-codes'
import _omit from 'lodash/omit'
import { User } from '@prisma/client'

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(StatusCodes.CREATED).send()
    } catch (error) {
        next(error)
    }
}

const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send()
    } catch (error) {
        next(error)
    }
}

const list = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send([])
    } catch (error) {
        next(error)
    }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send()
    } catch (error) {
        next(error)
    }
}

const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(StatusCodes.NO_CONTENT).send()
    } catch (error) {
        next(error)
    }
}

export default {
    create,
    get,
    list,
    update,
    remove
}
