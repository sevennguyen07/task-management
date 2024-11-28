import dotenv from 'dotenv'
import path from 'path'
import Joi from 'joi'

dotenv.config({ path: path.join(process.cwd(), '.env') })

const envSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('development', 'test', 'production').required(),
        SERVER_HOSTNAME: Joi.string().default('localhost'),
        SERVER_PORT: Joi.number().default(3000),
        CORS_ORIGIN: Joi.string().default('http://localhost:*')
    })
    .unknown()

const { value, error } = envSchema.prefs({ errors: { label: 'key' } }).validate(process.env)

if (error) {
    throw new Error(`Config invalid: ${error.message}`)
}

export default {
    NODE_ENV: value.NODE_ENV,
    SERVER_HOSTNAME: value.SERVER_HOSTNAME,
    SERVER_PORT: value.SERVER_PORT,
    CORS_ORIGIN: value.CORS_ORIGIN
}
