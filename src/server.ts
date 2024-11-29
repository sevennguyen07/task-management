import app from './app'
import config from './config/config'
import logger from './config/logger'

const server = app.listen(config.server.port, () => {
    logger.info(`Server (${config.env}) running on port http://${config.server.hostName}:${config.server.port}`)
    logger.info(`API docs avaiables on http://${config.server.hostName}:${config.server.port}/api/v1`)
})

const onCloseSignal = () => {
    logger.info('sigint received, shutting down')
    server.close(() => {
        logger.info('server closed')
        process.exit()
    })

    // Force shutdown after 10s
    setTimeout(() => process.exit(1), 10000).unref()
}

process.on('SIGINT', onCloseSignal)
process.on('SIGTERM', onCloseSignal)
