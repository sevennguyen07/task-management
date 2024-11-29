import express from 'express'
import healthRoute from './health.route'
import userRoute from './user.route'
import taskRoute from './task.route'

const router = express.Router()
router.use('/health', healthRoute)
router.use('/users', userRoute)
router.use('/users/tasks', taskRoute)

export default router
