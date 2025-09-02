import { GoogleGenerativeAI } from "@google/generative-ai"
import { GEMINI_API_KEY } from "../../constants"
import pdfParse from "pdf-parse"  
import mammoth from "mammoth"

class GeminiService {
  private genAI: GoogleGenerativeAI

  constructor() {
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key is required")
    }
    
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
  }

  async chatCompletion(prompt: string, fileContent?: string, fileType?: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      let fullPrompt = prompt

      if (fileContent && fileType) {
        fullPrompt = `You are a helpful AI assistant. The user has uploaded a ${fileType} file. Here is the content of the file:
        ---FILE CONTENT---
        ${fileContent}
        ---END FILE CONTENT---
        Please answer the user's question based on this file content and provide helpful insights.
        User's question: ${prompt}`
      }

      const result = await model.generateContent(fullPrompt)
      const response = result.response.text()

      if (!response) {
        throw new Error("No response received from Gemini")
      }

      return response
    } catch (error: any) {
      throw new Error(`Gemini API error: ${error.message}`)
    }
  }

  async analyzeImage(prompt: string, imageBuffer: Buffer): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const imagePart = {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType: "image/jpeg"
        }
      }

      const result = await model.generateContent([prompt, imagePart])
      const response = result.response.text()

      if (!response) {
        throw new Error("No response received from Gemini vision model")
      } 
      return response
    } catch (error: any) {
      throw new Error(`Gemini Vision API error: ${error.message}`)
    }
  }

  async analyzeDocument(prompt: string, documentBuffer: Buffer, filename: string): Promise<string> {
    try {
      const extension = filename.split('.').pop()?.toLowerCase()
      let extractedContent = ""

      // Extract content based on file type
      switch (extension) {
        case 'pdf':
          const pdfData = await pdfParse(documentBuffer)
          extractedContent = pdfData.text
          break
        
        case 'doc':
        case 'docx':
          const wordResult = await mammoth.extractRawText({ buffer: documentBuffer })
          extractedContent = wordResult.value
          break
        
        case 'csv':
          extractedContent = documentBuffer.toString('utf-8')
          break
        
        default:
          extractedContent = documentBuffer.toString('utf-8')
          break
      }

      // Limit content size for API
      const maxContentLength = 50000 // 50K characters limit
      if (extractedContent.length > maxContentLength) {
        extractedContent = extractedContent.substring(0, maxContentLength) + "truncated due to length"
      }

      // Analyze document content with Gemini
      const response = await this.chatCompletion(
        prompt,
        extractedContent,
        `${extension?.toUpperCase()} document`
      )

      return response
    } catch (error: any) {
      throw new Error(`Document analysis error: ${error.message}`)
    }
  }

  async analyzeVideo(prompt: string, videoBuffer: Buffer, filename: string): Promise<string> {
    try {
      // Note: Gemini cannot directly analyze video content from buffer
      // This provides metadata-based analysis and general guidance
      const fileSize = videoBuffer.length
      const fileSizeMB = Math.round(fileSize / (1024 * 1024) * 100) / 100
      const extension = filename.split('.').pop()?.toLowerCase()

      const videoMetadata = `Video File Information:
          - Filename: ${filename}
          - Format: ${extension?.toUpperCase()}
          - File Size: ${fileSizeMB} MB
          - Buffer Length: ${fileSize} bytes
          `

      const response = await this.chatCompletion(
        `${prompt} Video File Context:\n${videoMetadata} Note: While I cannot directly analyze video content, I can help with questions video-related guidance based on the file information provided.`,
        videoMetadata,
        "video file"
      )

      return response
    } catch (error: any) {
      throw new Error(`Video analysis error: ${error.message}`)
    }
  }
}

export default new GeminiService()