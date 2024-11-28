import cors from 'cors'
import express, { type Express } from 'express'
import helmet from 'helmet'
import compression from 'compression'
import config from './config/config'
import { errorHandler } from './middlewares/errorHandler'
import morgan from './config/morgan'
import routes from './routes'

const app: Express = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(compression())
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }))
app.use(helmet())

// http logging
app.use(morgan.successHandler)
app.use(morgan.errorHandler)

// Routes
app.use('/v1', routes)

//Error handlers
app.use(errorHandler)

export default app
