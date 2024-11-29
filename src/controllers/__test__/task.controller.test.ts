import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import { Request, Response, NextFunction } from 'express'
import { taskService } from '../../services'
import requireAuth from '../../middlewares/authHandler'
import app from '../../app'
import { Api404Error } from '../../utils/ApiError'

jest.mock('../../services')
jest.mock('../../middlewares/authHandler')

describe('Task Controller', () => {
    beforeEach(() => {
        ;(requireAuth as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => {
            req.context.user = { id: 1 }
            req.params = { id: '1' }
            next()
        })
    })

    describe('POST /api/v1/users/tasks (create)', () => {
        it('should create a new task and return it', async () => {
            const newTask = { title: 'Test Task', description: 'Test Description' }
            const createdTask = { ...newTask, id: 1, completed: false }

            ;(taskService.createTask as jest.Mock).mockResolvedValue(createdTask)

            const response = await request(app).post('/api/v1/users/tasks').send(newTask)
            expect(response.status).toBe(StatusCodes.CREATED)
            expect(taskService.createTask).toHaveBeenCalledWith({
                title: 'Test Task',
                description: 'Test Description',
                completed: false,
                ownerId: 1
            })
        })

        it('should return a validation error', async () => {
            await request(app)
                .post('/api/v1/users/tasks')
                .send({ description: 'Test Description' })
                .expect(StatusCodes.BAD_REQUEST, {
                    code: 400,
                    message: '"title" is required'
                })
        })

        it('should handle errors and pass them to next()', async () => {
            const newTask = { title: 'Test Task', description: 'Test Description' }
            const error = new Api404Error()

            ;(taskService.createTask as jest.Mock).mockRejectedValue(error)

            const response = await request(app).post('/api/v1/users/tasks').send(newTask)
            expect(response.status).toBe(StatusCodes.NOT_FOUND)
        })
    })

    describe('GET /api/v1/users/tasks/:id (get)', () => {
        it('should return a task by id', async () => {
            const task = { id: 1, title: 'Test Task', description: 'Test Description', completed: false, ownerId: 1 }
            ;(taskService.getTaskById as jest.Mock).mockResolvedValue(task)

            const response = await request(app).get('/api/v1/users/tasks/1')
            expect(response.status).toBe(StatusCodes.OK)
            expect(response.body).toEqual(task)
            expect(taskService.getTaskById).toHaveBeenCalledWith({ id: 1, ownerId: 1 })
        })

        it('should handle errors and pass them to next()', async () => {
            const error = new Api404Error()
            ;(taskService.getTaskById as jest.Mock).mockRejectedValue(error)

            const response = await request(app).get('/api/v1/users/tasks/1')
            expect(response.status).toBe(StatusCodes.NOT_FOUND)
            expect(taskService.getTaskById).toHaveBeenCalledWith({ id: 1, ownerId: 1 })
        })
    })

    describe('GET /api/v1/users/tasks (list)', () => {
        it('should return all tasks for the logged-in user', async () => {
            const tasks = [
                { id: 1, title: 'Test Task 1', description: 'Test Description 1', completed: false, ownerId: 1 },
                { id: 2, title: 'Test Task 2', description: 'Test Description 2', completed: true, ownerId: 1 }
            ]
            ;(taskService.listTaskByUserId as jest.Mock).mockResolvedValue(tasks)

            const response = await request(app).get('/api/v1/users/tasks')
            expect(response.status).toBe(StatusCodes.OK)
            expect(response.body).toEqual(tasks)
            expect(taskService.listTaskByUserId).toHaveBeenCalledWith(1)
        })
    })

    describe('PUT /api/v1/users/tasks/:id (update)', () => {
        it('should update a task and return the updated task', async () => {
            const updatedTask = { title: 'Updated Task', description: 'Updated Description' }
            const task = {
                id: 1,
                title: 'Updated Task',
                description: 'Updated Description',
                completed: false,
                ownerId: 1
            }

            ;(taskService.updateTaskById as jest.Mock).mockResolvedValue(task)

            const response = await request(app).patch('/api/v1/users/tasks/1').send(updatedTask)
            expect(response.status).toBe(StatusCodes.OK)
            expect(response.body).toEqual(task)
            expect(taskService.updateTaskById).toHaveBeenCalledWith({ id: 1, ownerId: 1 }, updatedTask)
        })

        it('should handle errors and pass them to next()', async () => {
            const updatedTask = { title: 'Updated Title' }
            const error = new Api404Error()
            ;(taskService.updateTaskById as jest.Mock).mockRejectedValue(error)

            const response = await request(app).patch('/api/v1/users/tasks/1').send(updatedTask)
            expect(response.status).toBe(StatusCodes.NOT_FOUND)
            expect(taskService.updateTaskById).toHaveBeenCalledWith({ id: 1, ownerId: 1 }, updatedTask)
        })
    })

    describe('DELETE /api/v1/users/tasks/:id (remove)', () => {
        it('should delete a task and return no content', async () => {
            ;(taskService.deleteTaskById as jest.Mock).mockResolvedValue(null)

            const response = await request(app).delete('/api/v1/users/tasks/1')
            expect(response.status).toBe(StatusCodes.NO_CONTENT)
            expect(taskService.deleteTaskById).toHaveBeenCalledWith({ id: 1, ownerId: 1 })
        })

        it('should handle errors and pass them to next()', async () => {
            const error = new Api404Error()
            ;(taskService.deleteTaskById as jest.Mock).mockRejectedValue(error)

            const response = await request(app).delete('/api/v1/users/tasks/1')
            expect(response.status).toBe(StatusCodes.NOT_FOUND)
            expect(taskService.deleteTaskById).toHaveBeenCalledWith({ id: 1, ownerId: 1 })
        })
    })
})
