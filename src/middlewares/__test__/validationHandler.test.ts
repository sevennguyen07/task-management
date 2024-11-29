import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import validationHandler from '../validationHandler'
import { ApiError } from '../../utils/ApiError'

jest.mock('../../utils/ApiError')

describe('Validation Handler Middleware', () => {
    it('should call next() when input is valid', () => {
        const schema = {
            body: Joi.object({
                name: Joi.string().required()
            })
        }

        const req = {
            body: { name: 'New Task' }
        } as Request

        const res = {} as Response
        const next = jest.fn() as NextFunction

        validationHandler(schema)(req, res, next)

        expect(next).toHaveBeenCalled()
    })

    it('should return BAD_REQUEST error when body is invalid', () => {
        const schema = {
            body: Joi.object({
                name: Joi.string().required()
            })
        }

        const req = {
            body: {}
        } as Request

        const res = {} as Response
        const next = jest.fn() as NextFunction

        validationHandler(schema)(req, res, next)
        expect(next).toHaveBeenCalledWith(expect.any(ApiError))
    })

    it('should return BAD_REQUEST error when params are invalid', () => {
        const schema = {
            params: Joi.object({
                id: Joi.number().required()
            })
        }

        const req = {
            params: {}
        } as Request

        const res = {} as Response
        const next = jest.fn() as NextFunction

        validationHandler(schema)(req, res, next)
        expect(next).toHaveBeenCalledWith(expect.any(ApiError))
    })

    it('should return BAD_REQUEST error when query is invalid', () => {
        const schema = {
            query: Joi.object({
                search: Joi.string().required()
            })
        }

        const req = {
            query: {}
        } as Request

        const res = {} as Response
        const next = jest.fn() as NextFunction

        validationHandler(schema)(req, res, next)
        expect(next).toHaveBeenCalledWith(expect.any(ApiError))
    })
})
