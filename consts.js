
export const TNAMES = {
  CONSUMPTIONPOINT: 'consumption_point',
  CONSUMPTIONSTATE: 'consumption_state'
}

export const STATUS = {
  NORMAL: 'normal',
  OVER: 'over',
  UNDER: 'under'
}

// export const MEDIUM = {
//   [0]: 'electricity',
//   [1]: 'water'
// }

export const MEDIUMTYPE = {
  BATT: 'batt',
  WATER: 'watr',
  WATER_REV: 'wrev',
  ELEKTRO: 'elek',
  ELEKTRO_LOW: 'elow'
}

export function getQB (knex, tablename, schema) {
  return schema
    ? knex(knex.ref(tablename).withSchema(schema))
    : knex(tablename)
}
export function tableName (tname) {
  return process.env.CUSTOM_MIGRATION_SCHEMA 
    ? `${process.env.CUSTOM_MIGRATION_SCHEMA}.${tname}`
    : tname
}