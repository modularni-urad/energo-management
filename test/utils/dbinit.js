import _ from 'underscore'
const Knex = require('knex')
const knexHooks = require('knex-hooks')

// const rand = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 15)
// process.env.DATABASE_URL = rand + 'test.sqlite'

export default function initDB (migrationsDir) {
  const opts = {
    client: 'sqlite3',
    connection: {
      filename: process.env.DATABASE_URL
    },
    useNullAsDefault: true,
    debug: true,
    migrations: {
      directory: migrationsDir
    }
  }
  const knex = Knex(opts)
  knexHooks(knex)
  knex.addHook('before', 'insert', 'consumption_point', (when, method, table, params) => {
    const data = knexHooks.helpers.getInsertData(params.query)
    data.info = JSON.stringify(data.info)
  })
  knex.addHook('after', 'select', 'consumption_point', (when, method, table, params) => {
    _.isArray(params.result)
      ? _.each(params.result, row => { row.info = JSON.parse(row.info) })
      : params.result.info = JSON.parse(params.result.info)
  })

  return knex.migrate.latest().then(() => {
    return knex
  })
}
