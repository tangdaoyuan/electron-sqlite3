import path from 'path'
import { app } from 'electron'

export const USER_DATA_DIR = app.getPath('userData')

export const USER_DB_DIR = path.join(USER_DATA_DIR, 'teddy_db')

export const USER_STORE_DIR = path.join(USER_DATA_DIR, 'teddy_storage')

export const DB_LIST = {
  IMAGE_LINK: 'i_link',
} as const
