import { StatusCodes } from 'http-status-codes'

class BaseError extends Error {
    statusCode: number
    isOperational: boolean

    constructor(statusCode: number, message: string | undefined, isOperational: boolean) {
        super(message)

        this.statusCode = statusCode
        this.isOperational = isOperational
        Error.captureStackTrace(this)
    }
}

export class Api404Error extends BaseError {
    constructor(statusCode = StatusCodes.NOT_IMPLEMENTED, message = 'Not found.', isOperational = true) {
        super(statusCode, message, isOperational)
    }
}
