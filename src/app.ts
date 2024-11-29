import cors from 'cors'
import express, { type Express } from 'express'
import helmet from 'helmet'
import compression from 'compression'
import { errorHandler } from './middlewares/errorHandler'
import morgan from './config/morgan'
import routes from './routes'
import { ApiError } from './utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import expressContext from 'express-request-context'

const app: Express = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(compression())
app.use(cors())
app.options('*', cors())
app.use(helmet())
app.use(expressContext())

// http logging
app.use(morgan.successHandler)
app.use(morgan.errorHandler)

// Routes
app.use('/v1', routes)

//404 for unknow apis
app.use((req, res, next) => {
    next(new ApiError(StatusCodes.NOT_FOUND, 'Not found'))
})

//Error handlers
app.use(errorHandler)

export default app
