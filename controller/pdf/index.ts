import { Request, Response } from "express"
import ResponseController from "../response"
import AIUser from "../../models/ai-user.model"
import PDFService from "../../utils/services/pdf.service"
import { sendEmail } from "../../utils/services/email.service"
import { IMailOptions } from "../../interfaces"
import { logger } from "../../shared/logger"

const pdfController = {
  generateUserPDF: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userEmail } = req.params
      
      if (!userEmail) {
        return ResponseController.errorResponse(res, "User email is required", 400)
      }

      // Find user data
      const user = await AIUser.findOne({ email: userEmail })
      
      if (!user) {
        return ResponseController.errorResponse(res, "User not found", 404)
      }

      if (!user.conversations || user.conversations.length === 0) {
        return ResponseController.errorResponse(res, "No conversations found for this user", 404)
      }

      // Estimate PDF size
      const estimatedSize = await PDFService.estimatePDFSize(user)
      
      if (estimatedSize > 10000000) { // 10MB limit
        return ResponseController.errorResponse(
          res, 
          `Estimated PDF size (${Math.round(estimatedSize / 1024 / 1024)}MB) exceeds 10MB limit. Consider reducing image count or quality.`, 
          400
        )
      }

      // Generate PDF
      const pdfBuffer = await PDFService.generateUserDataPDF(user)

      // Set response headers for PDF download
      const filename = `ai-chat-report-${userEmail.replace('@', '-').replace('.', '-')}-${Date.now()}.pdf`
      
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
      res.setHeader('Content-Length', pdfBuffer.length)

      return res.send(pdfBuffer)
    } catch (error: any) {
      return ResponseController.errorResponse(
        res,
        error.message ? error.message : "Failed to generate PDF report",
        500
      )
    }
  },

  emailUserPDF: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userEmail } = req.params
      
      if (!userEmail) {
        return ResponseController.errorResponse(res, "User email is required", 400)
      }

      // Find user data
      const user = await AIUser.findOne({ email: userEmail })
      
      if (!user) {
        return ResponseController.errorResponse(res, "User not found", 404)
      }

      if (!user.conversations || user.conversations.length === 0) {
        return ResponseController.errorResponse(res, "No conversations found for this user", 404)
      }

      // Estimate PDF size
      const estimatedSize = await PDFService.estimatePDFSize(user)
      
      if (estimatedSize > 10000000) { // 10MB limit
        return ResponseController.errorResponse(
          res, 
          `Estimated PDF size exceeds 10MB limit. Consider reducing size`, 
          400
        )
      }

      // Generate PDF
      const pdfBuffer = await PDFService.generateUserDataPDF(user)

      // Prepare email
      const filename = `ai-chat-report-${userEmail.replace('@', '-').replace('.', '-')}-${Date.now()}.pdf`
      
      const mailOptions: IMailOptions = {
        to: userEmail,
        subject: `Your AI Chat Session Report - ${new Date().toLocaleDateString()}`,
        text: `Hi there! Please find attached your AI Chat Session Report containing:

        Uploaded Files: ${user.uploadedFiles.length} files
        Conversations: ${user.conversations.length} chat interactions
        Report Generated: ${new Date().toLocaleString()}`
      }

      // Add PDF attachment to mail options
      const mailOptionsWithAttachment: IMailOptions = {
        ...mailOptions,
        attachments: [
          {
            filename,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ]
      }

      // Send email with PDF attachment using existing sendEmail method
      await new Promise<void>((resolve, reject) => {
        sendEmail(mailOptionsWithAttachment, (info: any, status?: boolean) => {
          if (status) {
            logger.info(`PDF email sent successfully with message id ${info.messageId}`)
            resolve()
          } else {
            logger.error(`Failed to send PDF email: ${info}`)
            reject(new Error('Failed to send email'))
          }
        })
      })

      return ResponseController.successResponse(
        res,
        {
          message: "PDF report emailed successfully",
          sentTo: userEmail,
          filename,
          pdfSizeMB: Math.round(pdfBuffer.length / 1024 / 1024 * 100) / 100,
          emailedAt: new Date().toISOString()
        },
        "PDF report sent to user email successfully",
        200
      )
    } catch (error: any) {
      return ResponseController.errorResponse(
        res,
        error.message ? error.message : "Failed to email PDF report",
        500
      )
    }
  }
}

export default pdfController