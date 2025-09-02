import { RouteConfig } from "interfaces"
import uploadController from "../controller/upload"
import { validateImageFile, validateVideoFile, validateDocumentFile } from "../middleware/validators.middleware"

const getUploadRoutes = (upload: any): RouteConfig[] => [
  {
    path: "/upload/image",
    method: "post", 
    middleware: [upload.single("image"), validateImageFile],
    controller: uploadController.uploadImageFile,
  },
  {
    path: "/upload/video",
    method: "post",
    middleware: [upload.single("video"), validateVideoFile],
    controller: uploadController.uploadVideoFile,
  },
  {
    path: "/upload/document",
    method: "post",
    middleware: [upload.single("document"), validateDocumentFile],
    controller: uploadController.uploadDocumentFile,
  },
  {
    path: "/upload/multiple", 
    method: "post",
    middleware: [upload.array("files", 5)],
    controller: uploadController.uploadMultipleFiles,
  },
  {
    path: "/getFileAccess/*",
    method: "get",
    controller: uploadController.getFileAccess
  },
]

export default getUploadRoutes