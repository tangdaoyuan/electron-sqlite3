
import type { Database } from 'better-sqlite3'

export interface ISqliteBuilderOption {
  dbName: string
}

export type SqliteDB = Database | null
