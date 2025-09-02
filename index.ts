import { logger } from "./shared/logger"
import createServer from "./app"
import { PORT } from "./constants"
import "./shared/db"

const port = PORT

const app = createServer()

try {
  app.listen(port, (): void => {
    logger.info(`Connected successfully on port ${port}`)
  })
} catch (error) {
  logger.error(`Error occured: ${(error as any).message}`)
}
