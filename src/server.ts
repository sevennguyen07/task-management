import app from './app'
import config from './config/config'
import logger from './config/logger'

const server = app.listen(config.SERVER_PORT, () => {
    logger.info(`Server (${config.NODE_ENV}) running on port http://${config.SERVER_HOSTNAME}:${config.SERVER_PORT}`)
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
