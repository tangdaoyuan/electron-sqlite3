
import path from 'path'
import { existsSync, mkdirSync } from 'fs'
import SqliteDatabase from 'better-sqlite3'
import Logger from 'electron-log'
import { knex } from 'knex'
import type { Knex } from 'knex'
import { DB_LIST, USER_DB_DIR } from './constant'
import type { ISqliteBuilderOption, SqliteDB } from './types'

class SqliteBuilder {
  private static instance?: SqliteBuilder
  private sqliteDB: SqliteDB = null
  private knexInstance: Knex | null = null

  constructor(_options: ISqliteBuilderOption) {
    this._init(_options)
  }

  static getInstance(options: ISqliteBuilderOption = {
    dbName: DB_LIST.IMAGE_LINK,
  }) {
    if (!this.instance)
      this.instance = new SqliteBuilder(options)

    return this.instance
  }

  private _dbPath(name: string) {
    if (!existsSync(USER_DB_DIR))
      mkdirSync(USER_DB_DIR, { recursive: true })

    return path.join(USER_DB_DIR, `${name}.db`)
  }

  _init(opt: ISqliteBuilderOption) {
    this.initDB(opt.dbName)
    this.initSqlParser()
  }

  initDB(dbName: string): SqliteDB {
    const absDbPath = this._dbPath(dbName)
    this.sqliteDB = new SqliteDatabase(absDbPath)
    Logger.info(`[DB] init database ${absDbPath} completed`)

    return this.sqliteDB
  }

  db(name = DB_LIST.IMAGE_LINK): SqliteDB {
    if (!this.sqliteDB)
      this.initDB(name)

    return this.sqliteDB
  }

  initSqlParser() {
    const config: Knex.Config = {
      client: 'better-sqlite3',
      connection: {
        filename: ':memory:',
      },
      useNullAsDefault: true,
    }

    this.knexInstance = knex(config)
  }

  sqlParser() {
    if (!this.knexInstance) {
      const config: Knex.Config = {
        client: 'better-sqlite3',
        connection: {
          filename: ':memory:',
        },
        useNullAsDefault: true,
      }

      this.knexInstance = knex(config)
    }

    return this.knexInstance
  }

  async dispose() {
    this.sqliteDB?.close()
    await this.knexInstance?.destroy()
  }
}

export default SqliteBuilder
