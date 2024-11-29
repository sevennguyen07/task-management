import { name, version } from '../../package.json'
import config from '../config/config'

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: `${name} API documentation`,
        version
    },
    security: [
        {
            bearerAuth: []
        }
    ],
    servers: [
        {
            url: `http://localhost:${config.server.port}/api/v1`
        }
    ]
}

export default swaggerDefinition
