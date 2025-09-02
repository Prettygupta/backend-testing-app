import "dotenv/config"
import express, { Application, Request, Response, NextFunction } from "express"
// import helmet from "helmet";
import HttpException, { sanitize } from "./shared/http-exception"
import locals from "./shared/locals.json"
import routes from "./routes"
import cors from "cors"

const createServer = (): express.Application => {
  const app: Application = express()
  // app.use(helmet());
  // Body parsing Middleware
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  // CORS Middleware
  const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
  }
  app.use(cors(corsOptions))

  // eslint-disable-next-line no-unused-vars
  app.get("/", async (_req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({
      success: true,
      message: "The server is running",
    })
  })

  // eslint-disable-next-line no-unused-vars
  app.get("/health", async (_req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({
      success: true,
      message: "The server is running",
    })
  })

  app.use("/api", routes)


  //  eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  app.use((_req, _res) => {
    throw new HttpException(404, locals.notFound)
  })

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    err = sanitize(err)
    return res.status(err.status).json({ err: err.message })
  })

  return app
}

export default createServer
