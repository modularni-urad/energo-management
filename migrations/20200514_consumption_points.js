import { TNAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.CONSUMPTIONPOINT, (table) => {
    table.increments('id').primary()
    table.string('types').notNullable()
    table.string('app_id')
    table.string('dev_id')
    table.string('desc')
    table.float('lat')
    table.float('lng')
    table.float('alt')
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.CONSUMPTIONPOINT)
}
