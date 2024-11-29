import Joi from 'joi'

const createTask = {
    body: Joi.object().keys({
        title: Joi.string().required().min(3),
        description: Joi.string().optional().min(3)
    })
}

const updateTask = {
    params: Joi.object().keys({
        id: Joi.number().integer()
    }),
    body: Joi.object()
        .keys({
            title: Joi.string().min(3),
            description: Joi.string().min(3),
            completed: Joi.boolean()
        })
        .min(1)
}

const deleteTask = {
    params: Joi.object().keys({
        id: Joi.number().integer()
    })
}

const getTask = {
    params: Joi.object().keys({
        id: Joi.number().integer()
    })
}

export default {
    createTask,
    updateTask,
    deleteTask,
    getTask
}
