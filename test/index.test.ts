import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import { rm } from 'fs/promises'
import { randomUUID } from 'crypto'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { SqliteBuilder } from '@'

function getFixtureDir(childDir: string) {
  return fileURLToPath(path.join(dirname(import.meta.url), 'fixture', childDir))
}

const DB_TABLE = 'image_link'

describe('sqlite builder', () => {
  beforeAll(() => {
    vi.mock('electron', () => ({
      app: {
        getPath: () => getFixtureDir('db'),
      },
    }))
  })

  // eslint-disable-next-line space-before-function-paren
  afterAll(async () => {
    const inst = SqliteBuilder.getInstance()
    inst?.dispose()
    await rm(getFixtureDir('db'), { recursive: true })
  })

  it('runs', () => {
    const inst = SqliteBuilder.getInstance()
    expect(inst.db()?.name).not.toBeNull()
  })

  it('create table', () => {
    const inst = SqliteBuilder.getInstance()
    expect(inst.db()).not.toBeNull()
    const parser = inst.sqlParser()
    const SQL = parser.schema.createTableIfNotExists(
      DB_TABLE, (table) => {
        table.text('_id').notNullable()
        table.text('_path').notNullable()
      }).toString()
    const db = inst.db()
    if (db) {
      db?.prepare(SQL).run()
      const TABLE_SQL = parser.queryBuilder().select('name').from('sqlite_master').where('type', 'table').andWhere('name', DB_TABLE).toString()
      const ret: any = db?.prepare(TABLE_SQL).get()
      expect(ret?.name).toBe(DB_TABLE)
    }
  })

  it('insert table row', () => {
    const inst = SqliteBuilder.getInstance()
    expect(inst.db()).not.toBeNull()
    const parser = inst.sqlParser()
    const db = inst.db()
    if (db) {
      const INSERT_SQL = parser(DB_TABLE).insert({ _id: randomUUID(), _path: randomUUID() }).toString()
      const ret = db?.prepare(INSERT_SQL).run()
      expect(ret.changes).greaterThan(0)
    }
  })
})
