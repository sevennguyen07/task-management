import { ErrorRequestHandler } from 'express'
import config from '../config/config'
import { StatusCodes } from 'http-status-codes'
import logger from '../config/logger'

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let { statusCode, message } = err

    if (config.NODE_ENV === 'production' && !err.isOperational) {
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR
        message = 'Something went wrong!'
    }

    res.locals.errorMessage = err.message

    const response = {
        code: statusCode,
        message,
        ...(config.NODE_ENV === 'development' && { stack: err.stack })
    }

    if (config.NODE_ENV === 'development') {
        logger.error(err)
    }

    res.status(statusCode).send(response)
}
