import { Response } from "express"
import { ISuccessResponse, IErrorResponse } from "interfaces"
import { logger } from "../../shared/logger"

class ResponseController {
  static successResponse = async (res: Response, data: unknown, message: string, status: number): Promise<Response> => {
    const successResponse: ISuccessResponse = {
      status,
      message,
      data,
    }
    return res.status(status).json(successResponse)
  }

  static errorResponse = async (res: Response, message: string, status: number): Promise<Response> => {
    const errorResponse: IErrorResponse = {
      status,
      message,
    }
    if (status === 500) logger.error(message)
    return res.status(status).json(errorResponse)
  }
}

export default ResponseController
