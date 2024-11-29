import Joi from 'joi'

export const password: Joi.CustomValidator<string> = (value, helpers) => {
    if (value.length < 8) {
        return helpers.error('password must be at least 8 characters')
    }
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        return helpers.error('password must contain at least 1 letter and 1 number')
    }
    return value
}

const createUser = {
    body: Joi.object().keys({
        name: Joi.string().optional().min(3),
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password)
    })
}

const updateUser = {
    body: Joi.object()
        .keys({
            name: Joi.string().min(3),
            email: Joi.string().email(),
            password: Joi.string().custom(password)
        })
        .min(1)
}

export default {
    createUser,
    updateUser
}
