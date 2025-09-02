import express from "express"
import multer from "multer"
import { RouteConfig } from "interfaces"
import multerConfig from "../config/multer.config"
import getUploadRoutes from "./upload.routes"
import getSaveRoutes from "./save.routes"
import aiChatRoutes from "./ai-chat.routes"
import pdfRoutes from "./pdf.routes"
import ErrorController from "../controller/error"
const router = express.Router()
const upload = multer(multerConfig)
const uploadRoutes = getUploadRoutes(upload)
const saveRoutes = getSaveRoutes()

const routes: RouteConfig[] = [...uploadRoutes, ...saveRoutes, ...aiChatRoutes, ...pdfRoutes]

routes.forEach((route: RouteConfig) => {
  const { path, method, validators, middleware, controller } = route
  const args = [...(middleware || []), ...(validators || []), controller]
  router[method](path, ...args)
})

router.use(ErrorController.errorHandler)

export default router
