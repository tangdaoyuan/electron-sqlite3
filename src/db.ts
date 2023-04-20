
import path from 'path'
import { existsSync, mkdirSync } from 'fs'
import type { Database } from 'better-sqlite3'
import SqliteDatabase from 'better-sqlite3'
import Logger from 'electron-log'
import { knex } from 'knex'
import type { Knex } from 'knex'
import { DB_LIST, USER_DB_DIR } from './constant'

type SqliteDB = Database | null
let sqliteDB: SqliteDB = null
let knexInstance: Knex | null = null

export function dbPath(name: string) {
  if (!existsSync(USER_DB_DIR))
    mkdirSync(USER_DB_DIR, { recursive: true })

  return path.join(USER_DB_DIR, `${name}.db`)
}

export function initDB(dbDir: string): SqliteDB {
  const absDbPath = dbPath(dbDir)
  sqliteDB = new SqliteDatabase(absDbPath)
  Logger.info(`[DB] init database ${absDbPath} completed`)

  return sqliteDB
}

export function db(name = DB_LIST.IMAGE_LINK): SqliteDB {
  if (!sqliteDB)
    initDB(name)

  return sqliteDB
}

export function sqlParser() {
  if (!knexInstance) {
    const config: Knex.Config = {
      client: 'better-sqlite3',
      connection: {
        filename: ':memory:',
      },
    }

    knexInstance = knex(config)
  }

  return knexInstance
}
