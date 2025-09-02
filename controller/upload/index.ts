import { Request, Response } from "express"
import ResponseController from "../response"
import S3Service from "../../utils/services/s3.service"
import { v4 as uuidv4 } from "uuid"

const uploadController = {

  uploadMultipleFiles: async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return ResponseController.errorResponse(res, "No files provided", 400)
      }

      const files = req.files.map((file: Express.Multer.File) => {
        const fileExtension = file.originalname.split('.').pop()
        const filename = `${uuidv4()}.${fileExtension}`
        
        return {
          buffer: file.buffer,
          mimetype: file.mimetype,
          filename,
          originalname: file.originalname
        }
      })

      const fileUrls = await S3Service.uploadMultipleFilesToS3(files)

      const uploadedFiles = files.map((file, index) => ({
        url: fileUrls[index],
        filename: file.filename,
        mimetype: file.mimetype,
        originalname: file.originalname
      }))

      return ResponseController.successResponse(
        res, 
        { files: uploadedFiles }, 
        "Files uploaded successfully", 
        200
      )
    } catch (error: any) {
      return ResponseController.errorResponse(
        res, 
        error.message ? error.message : "Failed to upload files", 
        500
      )
    }
  },

  uploadImageFile: async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!req.file) {
        return ResponseController.errorResponse(res, "No image file provided", 400)
      }

      const { buffer, mimetype, originalname } = req.file
      
      if (!mimetype.startsWith('image/')) {
        return ResponseController.errorResponse(res, "Only image files are allowed", 400)
      }

      const fileExtension = originalname.split('.').pop()
      const filename = `images/${uuidv4()}.${fileExtension}`

      const imageUrl = await S3Service.uploadFileToS3(buffer, mimetype, filename)

      return ResponseController.successResponse(
        res, 
        { 
          url: imageUrl, 
          filename, 
          mimetype, 
          originalname 
        }, 
        "Image uploaded successfully", 
        200
      )
    } catch (error: any) {
      return ResponseController.errorResponse(
        res, 
        error.message ? error.message : "Failed to upload image", 
        500
      )
    }
  },

  uploadVideoFile: async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!req.file) {
        return ResponseController.errorResponse(res, "No video file provided", 400)
      }

      const { buffer, mimetype, originalname } = req.file
      
      if (!mimetype.startsWith('video/')) {
        return ResponseController.errorResponse(res, "Only video files are allowed", 400)
      }

      const fileExtension = originalname.split('.').pop()
      const filename = `videos/${uuidv4()}.${fileExtension}`

      const videoUrl = await S3Service.uploadFileToS3(buffer, mimetype, filename)

      return ResponseController.successResponse(
        res, 
        { 
          url: videoUrl, 
          filename, 
          mimetype, 
          originalname 
        }, 
        "Video uploaded successfully", 
        200
      )
    } catch (error: any) {
      return ResponseController.errorResponse(
        res, 
        error.message ? error.message : "Failed to upload video", 
        500
      )
    }
  },

  uploadDocumentFile: async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!req.file) {
        return ResponseController.errorResponse(res, "No document file provided", 400)
      }

      const { buffer, mimetype, originalname } = req.file
      
      const documentMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ]

      if (!documentMimeTypes.includes(mimetype)) {
        return ResponseController.errorResponse(res, "Only document files (PDF, Word, Excel, CSV) are allowed", 400)
      }

      const fileExtension = originalname.split('.').pop()
      const filename = `documents/${uuidv4()}.${fileExtension}`

      const documentUrl = await S3Service.uploadFileToS3(buffer, mimetype, filename)

      return ResponseController.successResponse(
        res, 
        { 
          url: documentUrl, 
          filename, 
          mimetype, 
          originalname 
        }, 
        "Document uploaded successfully", 
        200
      )
    } catch (error: any) {
      return ResponseController.errorResponse(
        res, 
        error.message ? error.message : "Failed to upload document", 
        500
      )
    }
  },

  getFileAccess: async (req: Request, res: Response): Promise<Response> => {
    try {
      const filename = req.params[0] || req.params.filename

      if (!filename) {
        throw new Error("Filename not found")
      }

      const file: AWS.S3.GetObjectOutput = await S3Service.getFileAccessUrl(filename)

      if (!file) {
        throw new Error("Failed to get file access")
      }

      if (!file.ContentType) {
        throw new Error("Failed to get file content type")
      }

      res.setHeader("Content-Type", file.ContentType)
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`)

      return res.send(file.Body)
    } catch (error: any) {
      return ResponseController.errorResponse(res, error.message ? error.message : "Something went wrong", 500)
    }
  },
}

export default uploadController