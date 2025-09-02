import { Request, Response } from "express"
import ResponseController from "../response"
import AIUser from "../../models/ai-user.model"
import { ISaveRequest } from "../../interfaces"

const saveController = {
  saveCompleteSession: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userEmail, uploadedFiles, conversations }: ISaveRequest = req.body
      // Find or create user document
      let user = await AIUser.findOne({ email: userEmail })
      if (user) return ResponseController.errorResponse(res, "User session already saved", 400)
      user = new AIUser({
          email: userEmail,
          uploadedFiles: uploadedFiles,
          conversations: conversations
        })

      await user.save()

      return ResponseController.successResponse(
        res,
        {
          message: "Complete session saved successfully",
          user: {
            email: user.email,
            totalFiles: user.uploadedFiles.length,
            totalConversations: user.conversations.length,
            userId: user._id
          },
          createdAt: new Date().toISOString()
        },
        "Complete session saved to database successfully",
        201
      )
    } catch (error: any) {
      return ResponseController.errorResponse(
        res,
        error.message ? error.message : "Failed to save complete session",
        500
      )
    }
  }
}

export default saveController