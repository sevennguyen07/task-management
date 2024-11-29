import { Prisma, Task } from '@prisma/client'
import prisma from '../../config/prismaClient'
import taskService from '../task.service'
import { Api404Error } from '../../utils/ApiError'

jest.mock('../../config/prismaClient', () => ({
    task: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
        update: jest.fn()
    }
}))

describe('Task Service', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should create a task successfully', async () => {
        const taskData = { title: 'Test Task', description: 'Test description', ownerId: 1, completed: false }
        const createdTask = { id: 1, ...taskData }

        ;(prisma.task.create as jest.Mock).mockResolvedValue(createdTask)

        const result = await taskService.createTask(taskData)
        expect(result).toEqual(createdTask)
        expect(prisma.task.create).toHaveBeenCalledWith({
            data: {
                title: 'Test Task',
                description: 'Test description',
                ownerId: 1
            }
        })
    })

    it('should return the task when found by id and ownerId', async () => {
        const taskData = {
            id: 1,
            title: 'Test Task',
            description: 'Test description',
            ownerId: 1,
            completed: false
        }

        ;(prisma.task.findUnique as jest.Mock).mockResolvedValue(taskData)

        const result = await taskService.getTaskById({ id: 1, ownerId: 1 })
        expect(result).toEqual(taskData)
        expect(prisma.task.findUnique).toHaveBeenCalledWith({
            where: { id: 1, ownerId: 1 }
        })
    })

    it('should throw Api404Error if task is not found by id and ownerId', async () => {
        ;(prisma.task.findUnique as jest.Mock).mockResolvedValue(null)

        try {
            await taskService.getTaskById({ id: 1, ownerId: 1 })
        } catch (error) {
            expect(error).toBeInstanceOf(Api404Error)
            expect(prisma.task.findUnique).toHaveBeenCalledWith({
                where: { id: 1, ownerId: 1 }
            })
        }
    })

    it('should return a list of tasks for a given user', async () => {
        const tasks = [
            { id: 1, title: 'Task 1', description: 'Description 1', ownerId: 1, completed: false },
            { id: 2, title: 'Task 2', description: 'Description 2', ownerId: 1, completed: false }
        ]

        ;(prisma.task.findMany as jest.Mock).mockResolvedValue(tasks)

        const result = await taskService.listTaskByUserId(1)

        expect(result).toEqual(tasks)
        expect(prisma.task.findMany).toHaveBeenCalledWith({
            where: { ownerId: 1 }
        })
    })

    it('should delete a task successfully', async () => {
        const taskData = { id: 1, title: 'Test Task', description: 'Test description', ownerId: 1, completed: false }

        ;(prisma.task.findUnique as jest.Mock).mockResolvedValue(taskData)
        ;(prisma.task.delete as jest.Mock).mockResolvedValue(taskData)

        await taskService.deleteTaskById({ id: 1, ownerId: 1 })

        expect(prisma.task.findUnique).toHaveBeenCalledWith({
            where: { id: 1, ownerId: 1 }
        })
        expect(prisma.task.delete).toHaveBeenCalledWith({
            where: { id: taskData.id }
        })
    })

    it('should throw Api404Error if task to delete is not found', async () => {
        ;(prisma.task.findUnique as jest.Mock).mockResolvedValue(null)

        try {
            await taskService.deleteTaskById({ id: 1, ownerId: 1 })
        } catch (error) {
            expect(error).toBeInstanceOf(Api404Error)
            expect(prisma.task.findUnique).toHaveBeenCalledWith({
                where: { id: 1, ownerId: 1 }
            })
        }
    })

    it('should update a task successfully', async () => {
        const taskData = { id: 1, title: 'Old Task', description: 'Old description', ownerId: 1 }
        const updateBody: Prisma.TaskUpdateInput = { title: 'Updated Task', description: 'Updated description' }

        const updatedTask = { ...taskData, ...updateBody }

        ;(prisma.task.findUnique as jest.Mock).mockResolvedValue(taskData)
        ;(prisma.task.update as jest.Mock).mockResolvedValue(updatedTask)

        const result = await taskService.updateTaskById({ id: 1, ownerId: 1 }, updateBody)

        expect(result).toEqual(updatedTask)
        expect(prisma.task.findUnique).toHaveBeenCalledWith({
            where: { id: 1, ownerId: 1 }
        })
        expect(prisma.task.update).toHaveBeenCalledWith({
            where: { id: 1, ownerId: 1 },
            data: updateBody
        })
    })

    it('should throw Api404Error if task to update is not found', async () => {
        const updateBody: Prisma.TaskUpdateInput = { title: 'Updated Task', description: 'Updated description' }

        ;(prisma.task.findUnique as jest.Mock).mockResolvedValue(null)

        try {
            await taskService.updateTaskById({ id: 1, ownerId: 1 }, updateBody)
        } catch (error) {
            expect(error).toBeInstanceOf(Api404Error)
            expect(prisma.task.findUnique).toHaveBeenCalledWith({
                where: { id: 1, ownerId: 1 }
            })
        }
    })
})
