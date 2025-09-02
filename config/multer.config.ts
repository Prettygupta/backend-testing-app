import { Request } from "express"

const allowedMimeTypes = [
  "application/pdf",
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
  "video/mp4",
  "video/mov",
  "video/quicktime",
  "video/avi",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]

const multerConfig = {
  limits: {
    fileSize: 50000000, // 50MB for videos
    files: 5,
  },
  //@ts-ignore
  fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(null, false)
    }
  },
}

export default multerConfig
