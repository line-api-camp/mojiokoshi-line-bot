import 'dotenv/config'

// LINE

export const LINE_MESSAGING_CHANNEL_ACCESS_TOKEN = process.env
  .LINE_MESSAGING_CHANNEL_ACCESS_TOKEN as string
export const LINE_MESSAGING_CHANNEL_SECRET = process.env.LINE_MESSAGING_CHANNEL_SECRET as string

// Google

export const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL as string
export const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY as string
export const FB_PROJECT_ID = process.env.FB_PROJECT_ID as string
