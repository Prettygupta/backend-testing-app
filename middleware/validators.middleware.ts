import { Request, Response, NextFunction } from "express"
import {
  validateAIChat,
  validateSaveSession,
  validateFileAccess,
} from "../utils/validators/input.validators"
import ResponseController from "../controller/response"

type RequestData = Record<string, any>

export class InputValidator {
  private static async validateInput(
    _req: Request,
    res: Response,
    next: NextFunction,
    validationFunction: Function,
    data: RequestData,
  ) {
    try {
      const validationResult = await validationFunction(data)
      return validationResult === true ? next() : ResponseController.errorResponse(res, validationResult, 400)
    } catch (error: any) {
      return ResponseController.errorResponse(res, error.message || "Validation failed", 500)
    }
  }

  // AI chat validation
  public static async aiChatValidator(req: Request, res: Response, next: NextFunction) {
    return await InputValidator.validateInput(req, res, next, validateAIChat, req.body)
  }

  // Save session validation
  public static async saveSessionValidator(req: Request, res: Response, next: NextFunction) {
    return await InputValidator.validateInput(req, res, next, validateSaveSession, req.body)
  }
  
  // File access validation
  public static async fileAccessValidator(req: Request, res: Response, next: NextFunction) {
    const filename = req.params[0] || req.params.filename
    return await InputValidator.validateInput(req, res, next, validateFileAccess, { filename })
  }
}

// File type validation middleware
export const validateFileType = (allowedTypes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.file && !req.files) {
      return ResponseController.errorResponse(res, "No file provided", 400)
    }

    const files = req.files ? (Array.isArray(req.files) ? req.files : Object.values(req.files).flat()) : [req.file]

    for (const file of files) {
      if (file && !allowedTypes.includes(file.mimetype)) {
        return ResponseController.errorResponse(
          res, 
          `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`, 
          400
        )
      }
    }

    return next()
  }
}

// File size validation middleware
export const validateFileSize = (maxSizeInBytes: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const files = req.files ? (Array.isArray(req.files) ? req.files : Object.values(req.files).flat()) : [req.file]

    for (const file of files) {
      if (file && file.size > maxSizeInBytes) {
        return ResponseController.errorResponse(
          res, 
          `File size too large. Maximum allowed size: ${Math.round(maxSizeInBytes / (1024 * 1024))}MB`, 
          400
        )
      }
    }

    return next()
  }
}

// Specific file type validators
export const validateImageFile = validateFileType([
  "image/jpeg",
  "image/jpg", 
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp"
])

export const validateVideoFile = validateFileType([
  "video/mp4",
  "video/mov",
  "video/quicktime",
  "video/avi",
  "video/mkv",
  "video/webm"
])

export const validateDocumentFile = validateFileType([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv"
])