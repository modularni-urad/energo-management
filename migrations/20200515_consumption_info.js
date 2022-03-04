import _ from 'underscore'
import { TNAMES, STATUS, MEDIUMTYPE } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.CONSUMPTIONINFO, (table) => {
    table.integer('pointid').notNullable()
      .references('id').inTable(TNAMES.CONSUMPTIONPOINT)
    table.enum('type', _.values(MEDIUMTYPE)).notNullable()
    table.float('value').notNullable()
    table.float('mean')
    table.float('coeficient').notNullable()
    table.enu('status', _.values(STATUS)).notNullable().defaultTo(STATUS.NORMAL)
    table.primary(['pointid', 'type'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.CONSUMPTIONINFO)
}
