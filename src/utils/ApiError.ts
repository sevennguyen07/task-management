import { StatusCodes } from 'http-status-codes'

export class ApiError extends Error {
    statusCode: number
    isOperational: boolean

    constructor(statusCode: number, message: string | undefined, isOperational = true) {
        super(message)

        this.statusCode = statusCode
        this.isOperational = isOperational
        Error.captureStackTrace(this)
    }
}

export class Api404Error extends ApiError {
    constructor(statusCode = StatusCodes.NOT_FOUND, message = 'Not found.') {
        super(statusCode, message)
    }
}
