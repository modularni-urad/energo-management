import { TNAMES } from '../consts'

exports.up = (knex, Promise) => {
  const builder = process.env.CUSTOM_MIGRATION_SCHEMA
    ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
    : knex.schema

  return builder.createTable(TNAMES.CONSUMPTIONPOINT, (table) => {
    table.increments('id').primary()
    table.string('ico')
    table.string('buildingid')
    table.string('mediums').notNullable() // co to meri za veliciny

    table.integer('last_sequence') // prevence duplicit

    table.string('desc')
    table.string('sensor_sn') // cislo senzoru
    table.string('sensor_type') // typ sensoru
    table.string('sensor_id') // ID sensoru v IOT systemu
    
    table.string('distributor_id')  // ID odberneho mista
    table.string('device_id') // cislo produktomeru
    table.string('external_id')

    table.float('coef') // koeficient pro prepocet counter -> value
    table.string('start') // pocatecni hodnota counteru pro prepocet
    table.string('alerts')
    table.float('lat')
    table.float('lng')
    table.float('alt')
    table.string('createdby')
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  const builder = process.env.CUSTOM_MIGRATION_SCHEMA
    ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
    : knex.schema
  return builder.dropTable(TNAMES.CONSUMPTIONPOINT)
}