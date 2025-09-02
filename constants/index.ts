export const PORT = (process.env.PORT || 1057) as number
export const MONGO_URI = (process.env.MONGO_URI || "mongodb://root_admin:admin$miningauction*55@miningauction-mongodb-staging:27017/miningauction-db?authSource=admin") as string
export const MAIL_PASSWORD = (process.env.MAIL_PASSWORD || "mail-password") as string
export const MAIL_HOST = (process.env.MAIL_HOST || "smtp.gmail.com") as string
export const MAIL_PORT = (process.env.MAIL_PORT || 587) as number
export const INFO_EMAIL = (process.env.INFO_EMAIL || "testminingauction@gmail.com") as string
export const BACKEND_URL = (process.env.BACKEND_URL || "http://localhost:1057") as string
export const AWS_BUCKET_NAME = (process.env.AWS_BUCKET_NAME) as string
export const AWS_REGION = (process.env.AWS_REGION) as string
export const AWS_ACCESS_KEY_ID = (process.env.AWS_ACCESS_KEY_ID) as string
export const AWS_SECRET_ACCESS_KEY = (process.env.AWS_SECRET_ACCESS_KEY) as string
export const GEMINI_API_KEY = (process.env.GEMINI_API_KEY) as string