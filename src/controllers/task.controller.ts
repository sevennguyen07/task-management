import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import _omit from 'lodash/omit'
import { taskService } from '../services'
import { User } from '@prisma/client'

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description } = req.body
        const user = req.context.user as User
        const newTask = await taskService.createTask({
            title,
            description,
            completed: false,
            ownerId: user.id
        })

        res.status(StatusCodes.CREATED).send(newTask)
    } catch (error) {
        next(error)
    }
}

const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const user = req.context.user as User
        const task = await taskService.getTaskById({ id: Number(id), ownerId: user.id })
        res.send(task)
    } catch (error) {
        next(error)
    }
}

const list = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.context.user as User
        const tasks = await taskService.listTaskByUserId(user!.id)
        res.send(tasks)
    } catch (error) {
        next(error)
    }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const user = req.context.user as User
        const task = await taskService.updateTaskById({ id: Number(id), ownerId: user.id }, req.body)
        res.send(task)
    } catch (error) {
        next(error)
    }
}

const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const user = req.context.user as User
        await taskService.deleteTaskById({ id: Number(id), ownerId: user.id })
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
