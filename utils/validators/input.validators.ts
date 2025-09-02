import { Validator } from "node-input-validator"

// AI Chat validations
export const validateAIChat = async (data: any): Promise<boolean | string> => {
  const validator = new Validator(data, {
    prompt: "required|string|minLength:1|maxLength:2000",
    filename: "required|string|minLength:1|maxLength:500"
  })

  const matched = await validator.check()
  if (!matched) {
    const firstError = Object.values(validator.errors)[0] as string[] | undefined
    return firstError?.[0] || "Validation failed"
  }

  return true
}

// Save session validations
export const validateSaveSession = async (data: any): Promise<boolean | string> => {
  const validator = new Validator(data, {
    userEmail: "required|email|string",
    conversations: "required|array|minLength:1",
    "conversations.*.prompt": "required|string|minLength:1|maxLength:2000", 
    "conversations.*.response": "required|string|minLength:1|maxLength:10000"
  })

  const matched = await validator.check()
  if (!matched) {
    const firstError = Object.values(validator.errors)[0] as string[] | undefined
    return firstError?.[0] || "Validation failed"
  }

  return true
}

// File access validations
export const validateFileAccess = async (data: any): Promise<boolean | string> => {
  const validator = new Validator(data, {
    filename: "required|string|minLength:1|maxLength:500"
  })

  const matched = await validator.check()
  if (!matched) {
    const firstError = Object.values(validator.errors)[0] as string[] | undefined
    return firstError?.[0] || "Validation failed"
  }

  // Additional validation for filename format
  if (typeof data.filename === 'string') {
    const allowedPatterns = [
      /^images\/[a-f0-9-]+\.(jpg|jpeg|png|gif|webp|bmp)$/i,
      /^videos\/[a-f0-9-]+\.(mp4|mov|quicktime|avi|mkv|webm)$/i,
      /^documents\/[a-f0-9-]+\.(pdf|doc|docx|xls|xlsx|csv)$/i
    ]

    const isValidPattern = allowedPatterns.some(pattern => pattern.test(data.filename))
    
    if (!isValidPattern) {
      return "Invalid filename format. Expected format: folder/uuid.extension"
    }
  }

  return true
}