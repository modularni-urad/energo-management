import { TNAMES } from '../consts'
import entityMWBase from 'entity-api-base'
import _ from 'underscore'
const conf = {
  tablename: TNAMES.CONSUMPTIONPOINT,
  editables: [
    'ico', 'buildingid',
    'sensor_sn', 'sensor_type', 'sensor_id',
    'distributor_id', 'device_id', 'external_id',
    'desc', 'settings',
    'position', 'alt', 'note', 'medium'
  ]
}

export default (ctx) => {
  const { knex, ErrorClass } = ctx
  const MW = entityMWBase(conf, knex, ErrorClass)

  return { list, create, update }

  function list (query, schema) {
    query.filter = query.filter ? JSON.parse(query.filter) : {}
    return MW.list(query, schema)
  }

  function create (body, user, schema) {
    MW.check_data(body)
    Object.assign(body, { createdby: user.id })
    return MW.create(body, schema)
  }

  async function update(id, body, user, schema) {
    const existing = await MW.get(id, schema)
    if (!existing) throw new ErrorClass(404, 'survey not found')
    const now = new Date()
    if (now > existing.voting_start) {
      throw new ErrorClass(400, 'too late, voting in progress')
    }
    MW.check_data(body)
    return MW.update(id, body, schema)
  }
}
