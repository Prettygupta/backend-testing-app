import AWS from "aws-sdk"
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY, BACKEND_URL, AWS_BUCKET_NAME } from "../../constants"

class S3Service {
  private s3: AWS.S3
  private bucketName: string

  constructor() {
    this.s3 = new AWS.S3()
    this.s3.config.update({
      region: AWS_REGION,
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    })
    this.bucketName = AWS_BUCKET_NAME
  }

  async getFileAccessUrl(filename: string): Promise<AWS.S3.GetObjectOutput> {
    const params: AWS.S3.GetObjectRequest = {
      Bucket: this.bucketName,
      Key: filename,
    }

    try {
      const data: AWS.S3.GetObjectOutput = await this.s3.getObject(params).promise()
      return data
    } catch (error: any) {
      throw new Error(`Failed to get file access url: ${error.message}`)
    }
  }

  async uploadFileToS3(fileBuffer: Buffer, mimetype: string, filename: string): Promise<string> {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: filename,
      Body: fileBuffer,
      ContentType: mimetype,
    }

    try {
      const data = await this.s3.upload(params).promise()
      const fileUrl = data.Location && `${BACKEND_URL}/api/getFileAccess/${filename}`
      return fileUrl
    } catch (error: any) {
      throw new Error(`Failed to upload file to S3: ${error?.message}`)
    }
  }

  async uploadMultipleFilesToS3(files: Array<{ buffer: Buffer; mimetype: string; filename: string }>): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadFileToS3(file.buffer, file.mimetype, file.filename))
    
    try {
      const urls = await Promise.all(uploadPromises)
      return urls
    } catch (error: any) {
      throw new Error(`Failed to upload multiple files to S3: ${error?.message}`)
    }
  }
}

export default new S3Service()
