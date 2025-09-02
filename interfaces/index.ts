import { Request, Response } from "express"


export interface IChatRequest {
  prompt: string
  filename: string
}

export interface ISaveRequest {
  userEmail: string
  uploadedFiles?: string[] // Array of S3 URLs
  conversations: Array<{
    prompt: string
    response: string
  }>
}

export interface IMailOptions {
  to: string
  subject: string
  which?: string
  text: string
  attachments?: Array<{
    filename: string
    content: Buffer
    contentType: string
  }>
}


export interface UserData {
  email: string
  uploadedFiles: string[]
  conversations: Array<{
    prompt: string
    response: string
  }>
  createdAt: Date
  updatedAt: Date
}

export interface ISuccessResponse {
  status: number
  message: string | object
  data?: any
}

export interface IErrorResponse {
  status: number
  message: string | object
  error?: any
}
export interface RouteConfig {
  path: string
  method: "get" | "post" | "put" | "delete" | "patch"
  validators?: any[] | undefined
  middleware?: any[] | undefined
  controller: (req: Request, res: Response) => Promise<Response | void>
}
