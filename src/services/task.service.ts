import { Prisma, Task } from '@prisma/client'
import prisma from '../config/prismaClient'
import { Api404Error } from '../utils/ApiError'
import { TTaskCreate, TTaskQuery, TUserID } from '../types/types'

const createTask = async (task: TTaskCreate): Promise<Task> => {
    const { title, description, ownerId } = task

    return prisma.task.create({
        data: {
            title,
            description,
            ownerId
        }
    })
}

const getTaskById = async (query: TTaskQuery): Promise<Task | null> => {
    const { id, ownerId } = query
    const task = await prisma.task.findUnique({
        where: { id, ownerId }
    })

    if (!task) {
        throw new Api404Error()
    }

    return task
}

const listTaskByUserId = async (ownerId: TUserID): Promise<Task[]> => {
    return prisma.task.findMany({
        where: { ownerId }
    })
}

const deleteTaskById = async (query: TTaskQuery): Promise<void> => {
    const task = await getTaskById(query)
    if (!task) {
        throw new Api404Error()
    }

    await prisma.task.delete({ where: { id: task.id } })
}

const updateTaskById = async (query: TTaskQuery, updateBody: Prisma.TaskUpdateInput): Promise<Task> => {
    const task = await getTaskById(query)
    if (!task) {
        throw new Api404Error()
    }
    const updatedTask = await prisma.task.update({
        where: query,
        data: updateBody
    })

    return updatedTask
}

export default {
    createTask,
    getTaskById,
    listTaskByUserId,
    deleteTaskById,
    updateTaskById
}
