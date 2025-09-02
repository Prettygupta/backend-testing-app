import mongoose from "mongoose"
import aiUserSchema from "./schema/ai-user.schema"

export interface IConversation {
  prompt: string
  response: string
}

export interface IAIUser extends mongoose.Document {
  email: string
  uploadedFiles: string[] 
  conversations: IConversation[]
  createdAt: Date
  updatedAt: Date
}

const AIUser = mongoose.model<IAIUser>("AIUser", aiUserSchema)

export default AIUser