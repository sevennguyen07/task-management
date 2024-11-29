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

const userLogin = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password)
    })
}

const userLogout = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required()
    })
}

export default {
    userLogin,
    userLogout
}
