import PDFDocument from "pdfkit"
import sharp from "sharp"
import S3Service from "./s3.service"
import { UserData } from "../../interfaces"

class PDFService {
  async generateUserDataPDF(userData: UserData): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({ 
          size: 'A4',
          margins: { top: 50, bottom: 50, left: 50, right: 50 }
        })
        
        const buffers: Buffer[] = []
        doc.on('data', buffers.push.bind(buffers))
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers)
          resolve(pdfBuffer)
        })

        // Add title
        doc.fontSize(20).font('Helvetica-Bold')
        doc.text('AI Chat Session Report', { align: 'center' })
        doc.moveDown(1)

        // Add user info
        doc.fontSize(14).font('Helvetica-Bold')
        doc.text('User Information:', { underline: true })
        doc.fontSize(12).font('Helvetica')
        doc.text(`Email: ${userData.email}`)
        doc.text(`Report Generated: ${new Date().toLocaleString()}`)
        doc.text(`Session Created: ${userData.createdAt.toLocaleString()}`)
        doc.text(`Last Updated: ${userData.updatedAt.toLocaleString()}`)
        doc.moveDown(1)

        // Add uploaded files section
        if (userData.uploadedFiles && userData.uploadedFiles.length > 0) {
          doc.fontSize(14).font('Helvetica-Bold')
          doc.text('Uploaded Files:', { underline: true })
          doc.moveDown(0.5)

          for (let i = 0; i < userData.uploadedFiles.length; i++) {
            const fileUrl = userData.uploadedFiles[i]
            const filename = this.extractFilenameFromUrl(fileUrl)
            const isImage = this.isImageFile(filename)
            const isVideo = this.isVideoFile(filename)

            doc.fontSize(12).font('Helvetica-Bold')
            doc.text(`File ${i + 1}: ${filename}`)
            
            if (isImage) {
              try {
                // Embed optimized image
                await this.addOptimizedImageToPDF(doc, filename)
                doc.moveDown(0.5)
              } catch (error) {
                doc.fontSize(10).font('Helvetica')
                doc.text(`   [Image could not be embedded: ${fileUrl}]`)
                doc.moveDown(0.5)
              }
            } else if (isVideo) {
              doc.fontSize(10).font('Helvetica')
              doc.text(`   Video Link: ${fileUrl}`)
              doc.moveDown(0.5)
            } else {
              doc.fontSize(10).font('Helvetica')
              doc.text(`   Document Link: ${fileUrl}`)
              doc.moveDown(0.5)
            }
          }
          doc.moveDown(1)
        }

        // Add conversations section
        if (userData.conversations && userData.conversations.length > 0) {
          doc.fontSize(14).font('Helvetica-Bold')
          doc.text('AI Conversations:', { underline: true })
          doc.moveDown(0.5)

          userData.conversations.forEach((conversation, index) => {
            // Check if we need a new page
            if (doc.y > 700) {
              doc.addPage()
            }

            doc.fontSize(12).font('Helvetica-Bold')
            doc.text(`Conversation ${index + 1}:`)
            
            doc.fontSize(11).font('Helvetica-Bold')
            doc.fillColor('#2563eb')
            doc.text('User:', { continued: true })
            doc.font('Helvetica').fillColor('black')
            doc.text(` ${conversation.prompt}`)
            doc.moveDown(0.3)
            
            doc.fontSize(11).font('Helvetica-Bold')
            doc.fillColor('#dc2626')
            doc.text('AI:', { continued: true })
            doc.font('Helvetica').fillColor('black')
            doc.text(` ${conversation.response}`)
            doc.moveDown(0.8)
          })
        }

        // Add footer
        doc.fontSize(8).font('Helvetica')
        doc.text(`Generated on ${new Date().toLocaleString()}`, 50, doc.page.height - 30, {
          align: 'center'
        })

        doc.end()
      } catch (error) {
        reject(error)
      }
    })
  }

  private extractFilenameFromUrl(url: string): string {
    // Extract filename from S3 URL
    const parts = url.split('/')
    return parts[parts.length - 1]
  }

  private isImageFile(filename: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']
    const extension = filename.split('.').pop()?.toLowerCase()
    return imageExtensions.includes(extension || '')
  }

  private isVideoFile(filename: string): boolean {
    const videoExtensions = ['mp4', 'mov', 'quicktime', 'avi', 'mkv', 'webm']
    const extension = filename.split('.').pop()?.toLowerCase()
    return videoExtensions.includes(extension || '')
  }

  private async addOptimizedImageToPDF(doc: PDFKit.PDFDocument, filename: string): Promise<void> {
    try {
      // Get image from S3
      const imageBuffer = await S3Service.getFileAccessUrl(filename)
      const imageData = imageBuffer.Body as Buffer

      if (!imageData) {
        throw new Error('Could not retrieve image data')
      }

      // Optimize image with Sharp
      const optimizedImage = await sharp(imageData)
        .resize(400, 300, { 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .jpeg({ 
          quality: 70,
          progressive: true 
        })
        .toBuffer()

      // Add image to PDF
      doc.image(optimizedImage, {
        fit: [400, 300],
        align: 'center',
        valign: 'center'
      })
    } catch (error: any) {
      throw new Error(`Failed to add image to PDF: ${error.message}`)
    }
  }

  async estimatePDFSize(userData: UserData): Promise<number> {
    let estimatedSize = 50000 // Base PDF size (50KB)
    estimatedSize += userData.conversations.length * 2000 // ~2KB per conversation
    const imageCount = userData.uploadedFiles.filter(url => 
      this.isImageFile(this.extractFilenameFromUrl(url))
    ).length
    estimatedSize += imageCount * 100000 // ~100KB per optimized image
    return estimatedSize
  }
}

export default new PDFService()