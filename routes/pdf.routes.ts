import { RouteConfig } from "interfaces"
import pdfController from "../controller/pdf"

const pdfRoutes: RouteConfig[] = [
  {
    path: "/pdf/generate/:userEmail",
    method: "get",
    controller: pdfController.generateUserPDF,
  },
  {
    path: "/pdf/email/:userEmail",
    method: "post",
    controller: pdfController.emailUserPDF,
  },
]

export default pdfRoutes