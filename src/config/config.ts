import dotenv from 'dotenv'
import path from 'path'
import Joi from 'joi'

dotenv.config({ path: path.join(process.cwd(), '.env') })

const envSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('development', 'test', 'production').required(),
        SERVER_HOSTNAME: Joi.string().default('localhost'),
        SERVER_PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().required(),
        JWT_REFRESH_EXPIRATION_DAYS: Joi.number().required()
    })
    .unknown()

const { value, error } = envSchema.prefs({ errors: { label: 'key' } }).validate(process.env)

if (error) {
    throw new Error(`Config invalid: ${error.message}`)
}

export default {
    env: value.NODE_ENV,
    server: {
        hostName: value.SERVER_HOSTNAME,
        port: value.SERVER_PORT
    },
    database: {
        url: value.DATABASE_URL
    },
    jwt: {
        secret: value.JWT_SECRET,
        accessExpirationInMinutes: value.JWT_ACCESS_EXPIRATION_MINUTES,
        refrestExpirationInDays: value.JWT_REFRESH_EXPIRATION_DAYS
    }
}
