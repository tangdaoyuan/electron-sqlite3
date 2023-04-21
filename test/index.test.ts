import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import { rmdir } from 'fs/promises'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { SqliteBuilder } from '@'

function getFixtureDir(childDir: string) {
  return fileURLToPath(path.join(dirname(import.meta.url), 'fixture', childDir))
}

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
    await rmdir(getFixtureDir('db'), { recursive: true })
  })

  it('runs', () => {
    const inst = SqliteBuilder.getInstance()
    expect(inst.db()?.name).not.toBeNull()
    inst?.dispose()
  })
})
