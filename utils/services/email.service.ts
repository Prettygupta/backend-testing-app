import nodemailer from "nodemailer"
import { IMailOptions } from "../../interfaces"
import { logger } from "../../shared/logger"
import { INFO_EMAIL, MAIL_PASSWORD, MAIL_HOST, MAIL_PORT } from "../../constants"

export const sendEmail = async (mailOptions: IMailOptions, callback: (info: any, status?: boolean) => void) => {
  let transporter = nodemailer.createTransport({
    //@ts-ignore
    host: MAIL_HOST || "smtp.gmail.com",
    port: MAIL_PORT || 587,
    secure: process.env.MAIL_SECURE || false,
    auth: {
      user: INFO_EMAIL,
      pass: MAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

  try {
    const info = await transporter.sendMail(mailOptions)
    callback(info, true)
  } catch (error) {
    logger.error(`sendEmail - Error in sending email: ${error}`)
    callback(error, false)
  }
}