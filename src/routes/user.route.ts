import express from 'express'
const router = express.Router()
import { authValidation, userValidation } from '../validations'
import validationHandler from '../middlewares/validationHandler'
import { authController, userController } from '../controllers'
import requireAuth from '../middlewares/authHandler'

router.route('/').post(validationHandler(userValidation.createUser), userController.create)
router
    .route('/me')
    .get(requireAuth, userController.get)
    .patch(requireAuth, validationHandler(userValidation.updateUser), userController.update)
    .delete(requireAuth, userController.remove)

router.route('/login').post(validationHandler(authValidation.userLogin), authController.login)
router.route('/logout').post(requireAuth, validationHandler(authValidation.userLogout), authController.logout)

export default router
