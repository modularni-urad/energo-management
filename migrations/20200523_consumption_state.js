import _ from 'underscore'
import { TNAMES, MEDIUMTYPE } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.CONSUMPTIONSTATE, (table) => {
    table.integer('pointid').notNullable()
      .references('id').inTable(TNAMES.CONSUMPTIONPOINT)
    table.enum('type', _.values(MEDIUMTYPE))
    table.string('author')
    table.float('value').notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    table.primary(['pointid', 'type', 'created'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.CONSUMPTIONSTATE)
}
