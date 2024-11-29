import express from 'express'
const router = express.Router()
import { taskController } from '../controllers'
import { taskValidation } from '../validations'
import validationHandler from '../middlewares/validationHandler'
import requireAuth from '../middlewares/authHandler'

router
    .route('/')
    .post(requireAuth, validationHandler(taskValidation.createTask), taskController.create)
    .get(requireAuth, taskController.list)
router
    .route('/:id')
    .get(requireAuth, validationHandler(taskValidation.getTask), taskController.get)
    .patch(requireAuth, validationHandler(taskValidation.updateTask), taskController.update)
    .delete(requireAuth, validationHandler(taskValidation.deleteTask), taskController.remove)

export default router
