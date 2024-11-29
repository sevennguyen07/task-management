import express from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import swaggerDefinition from '../docs/swagger'

const router = express.Router()

const swaggerSpecs = swaggerJsdoc({
    swaggerDefinition,
    apis: ['src/docs/*.yml', 'src/routes/*.ts']
})

router.use('/', swaggerUi.serve)
router.get(
    '/',
    swaggerUi.setup(swaggerSpecs, {
        explorer: true
    })
)
export default router
