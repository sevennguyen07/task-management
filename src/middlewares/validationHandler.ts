import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { ApiError } from '../utils/ApiError'
import _pick from 'lodash/pick'

const validationHandler = (schema: object) => (req: Request, res: Response, next: NextFunction) => {
    const validSchema = _pick(schema, ['params', 'query', 'body'])
    const obj = _pick(req, Object.keys(validSchema))

    const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: 'key' }, abortEarly: false })
        .validate(obj)

    if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ')
        return next(new ApiError(StatusCodes.BAD_REQUEST, errorMessage))
    }

    Object.assign(req, value)
    return next()
}

export default validationHandler
