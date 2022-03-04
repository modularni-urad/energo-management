import { TNAMES, tableName } from '../consts'

exports.up = (knex, Promise) => {
  const builder = process.env.CUSTOM_MIGRATION_SCHEMA
    ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
    : knex.schema

  return builder.createTable(TNAMES.CONSUMPTIONSTATE, (table) => {
    table.integer('pointid').notNullable()
      .references('id').inTable(tableName(TNAMES.CONSUMPTIONPOINT))
    table.string('type', 8).notNullable()
    table.string('author')
    table.integer('counter')
    table.float('value')
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    table.primary(['pointid', 'type', 'created'])
  })
}

exports.down = (knex, Promise) => {
  const builder = process.env.CUSTOM_MIGRATION_SCHEMA
    ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
    : knex.schema
  return builder.dropTable(TNAMES.CONSUMPTIONSTATE)
}
