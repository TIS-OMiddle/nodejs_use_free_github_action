import dotenv from 'dotenv'

dotenv.config()

export const config = {
  selfEmail: process.env.SELF_EMAIL,
  selfEmailToken: process.env.SELF_EMAIL_TOKEN,
  targetEmail: process.env.TARGET_EMAIL,
  mid: process.env.MID,
  shadowToken: process.env.SHADOW_TOKEN,
  miHaYouToken: process.env.MI_HA_YO_TOKEN,
  dev: !!process.env.DEV,
}