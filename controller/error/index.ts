import { NextFunction, Request, Response } from "express"
import { MulterError } from "multer"
import ResponseController from "../response"

class ErrorController {
  public static async errorHandler(
    err: any,
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    if (err instanceof MulterError) {
      const message = err.message === "Too many files" ? "Maximum 5 images are allowed" : err.message
      return ResponseController.errorResponse(res, message, 400)
    }
    next(err)
  }
}

export default ErrorController
