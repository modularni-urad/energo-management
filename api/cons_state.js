import { TNAMES, getQB } from '../consts'
import entityMWBase from 'entity-api-base'
import _ from 'underscore'
const conf = {
  tablename: TNAMES.CONSUMPTIONSTATE
}

export default (ctx) => {
  const { knex, ErrorClass } = ctx
  const MW = entityMWBase(conf, knex, ErrorClass)

  return { list, create }

  function list (query, schema) {
    query.filter = query.filter ? JSON.parse(query.filter) : {}
    return MW.list(query, schema)
  }

  async function create (pointid, body, user, schema) {
    pointid = pointid || body.id
    if (!pointid) throw new ErrorClass(400, 'point.id is missing')
    const pointQB = getQB(knex, TNAMES.CONSUMPTIONPOINT, schema).where({ id: pointid })
    const point = await pointQB.first()
    if (body.sequence && point.last_sequence === body.sequence) {
      return 'omited due same sequence number'
    }
    return Promise.all([
      _insertData(point, body, user, schema),
      pointQB.update({ last_sequence: body.sequence })
    ])
  }

  function _insertData (cPoint, body, author, schema) {
    const pointSettings = _.isObject(cPoint.settings) 
      ? cPoint.settings
      : JSON.parse(cPoint.settings)
    const data = _.map(pointSettings, (settings, type) => {
      const counter = Number(body[type])
      const value = settings.start && settings.coef
        ? (counter + settings.start) * settings.coef
        : null
      // TODO: update mean
      return { pointid: cPoint.id, counter, author, value, type, created: body.time }
    })
    return getQB(knex, TNAMES.CONSUMPTIONSTATE, schema).insert(data)
  }

}
