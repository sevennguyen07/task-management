import express from 'express'
import healthRoute from './health.route'
import userRoute from './user.route'
import taskRoute from './task.route'
import docRoute from './doc.route'

const router = express.Router()
router.use('/', docRoute)
router.use('/health', healthRoute)
router.use('/users', userRoute)
router.use('/users/tasks', taskRoute)

export default router
