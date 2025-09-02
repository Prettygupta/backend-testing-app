import { Request, Response } from "express"
import ResponseController from "../response"
import GeminiService from "../../utils/services/gemini.service"
import S3Service from "../../utils/services/s3.service"
import { IChatRequest } from "../../interfaces"

const aiChatController = {
  chatAboutFile: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { prompt, filename }: IChatRequest = req.body

      const extension = filename.split('.').pop()?.toLowerCase()
      const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension || '')
      const isVideo = ['mp4', 'mov', 'quicktime', 'avi'].includes(extension || '')
      const isDocument = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv'].includes(extension || '')

      let response: string

      if (isImage) {
        try {
          const imageData = await S3Service.getFileAccessUrl(filename)
          const imageBuffer = imageData.Body as Buffer
          
          if (!imageBuffer) {
            throw new Error("Could not retrieve image data")
          }
          
          response = await GeminiService.analyzeImage(prompt, imageBuffer)
        } catch (imageError: any) {
          // Fallback to text-based response if image analysis fails
          response = await GeminiService.chatCompletion(
            `I cannot directly analyze this image (${filename}), but I can help answer or provide guidance on image-related topics.`
          )
        }
      } else if (isVideo) {
        // For videos, get video buffer from S3 and analyze metadata
        try {
          const videoData = await S3Service.getFileAccessUrl(filename)
          const videoBuffer = videoData.Body as Buffer
          
          if (!videoBuffer) {
            throw new Error("Could not retrieve video data")
          }
          
          response = await GeminiService.analyzeVideo(prompt, videoBuffer, filename)
        } catch (videoError: any) {
          // Fallback to text-based response if video analysis fails
          response = await GeminiService.chatCompletion(
            `I cannot access this video file (${filename}), but I can help answer general questions or provide guidance on video-related topics.`
          )
        }
      } else if (isDocument) {
        // For documents, get document buffer from S3 and extract content  
        try {
          const documentData = await S3Service.getFileAccessUrl(filename)
          const documentBuffer = documentData.Body as Buffer
          
          if (!documentBuffer) {
            throw new Error("Could not retrieve document data")
          }
          
          response = await GeminiService.analyzeDocument(prompt, documentBuffer, filename)
        } catch (documentError: any) {
          // Fallback to text-based response if document analysis fails
          response = await GeminiService.chatCompletion(
            `I cannot access this document file (${filename}), but I can help answer general questions or provide guidance related to this file type.`
          )
        }
      } else {
        // For other file types, provide general assistance
        response = await GeminiService.chatCompletion(
          `This is regarding a file named "${filename}". I can help answer general questions or provide guidance related to this file.`
        )
      }

      return ResponseController.successResponse(
        res,
        {
          response,
          filename,
          fileType: isImage ? 'image' : isVideo ? 'video' : isDocument ? 'document' : 'other',
          hasDirectAnalysis: isImage || isDocument || isVideo,
          aiModel: 'gemini-1.5-flash',
          timestamp: new Date().toISOString()
        },
        "AI response generated successfully",
        200
      )
    } catch (error: any) {
      return ResponseController.errorResponse(
        res,
        error.message ? error.message : "Failed to generate AI response",
        500
      )
    }
  }
}

export default aiChatController