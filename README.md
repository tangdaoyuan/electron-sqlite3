# @suger-tdy/electron-sqlite3

> Personal electron sqlite3 Utils For Electron

# Install

```bash

pnpm install @suger-tdy/electron-sqlite3

```

# Usage
```ts
import { SqliteBuilder } from '@suger-tdy/electron-sqlite3'

let dbReady = false

function DB(DB_TABLE: string) {
  // Init DB
  const inst = SqliteBuilder.getInstance()
  const _db = inst.db()
  const parser = SqliteBuilder.getInstance().sqlParser()

  if (!dbReady) {
    // Create Table
    const SQL = parser.schema.createTableIfNotExists(DB_TABLE, (table) => {
      table.text('_id').notNullable()
      table.text('_path').notNullable()
    }).toString()
    _db.prepare(SQL).run()
    dbReady = true
  }

  return _db
}
```

```ts
// Create or Update Row
function _create(id: string, filePath: string) {
  const _db = DB()
  const INSERT_SQL = parser().insert({ _id: id, _path: filePath }).toString()
  const _func = _db.transaction(() => {

    if (!_getFile(id)) {
      const stmt = _db.prepare(INSERT_SQL)
      stmt.run()
    }
    else {
      const stmt = _db.prepare(UPDATE_SQL)
      stmt.run()
    }
  })
  _func()
}
```
```ts

// Delete Row
function _delete(id: string) {
  const _db = DB()

  const DELETE_SQL = parser()
    .delete()
    .where('_id', id)
    .toString()

  const stmt = _db.prepare(DELETE_SQL)
  stmt.run(id)
}
```
```ts
// Select Row
function _select(id: string) {
  const _db = DB()
  const SQL = parser().select('*').where('_id', id).toString()
  const stmt = _db.prepare(SQL)
  return stmt.get()
}
```
### Don't forget `Dispose`

```ts

app.on('will-quit', async(event) => {
  // ...
  try {
    await SqliteBuilder.getInstance().dispose()
  }
  catch (error) {
    // error
  }

})
```


# TODO

- [ ] multiple `DB` init
