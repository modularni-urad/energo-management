import { whereFilter } from 'knex-filter-loopback'
import { TNAMES } from '../consts'
import _ from 'underscore'

export default (ctx) => {
  const { knex, auth, JSONBodyParser } = ctx
  const app = ctx.express()

  app.get('/', (req, res, next) => {
    knex(TNAMES.CONSUMPTIONSTATE).where(whereFilter(req.query)).then(info => {
      res.json(info)
      next()
    }).catch(next)
  })

  function _insertData (cPoint, body, author, created) {
    const data = _.map(body, (value, type) => {
      // TODO: if type === battery ...
      value = value * (cPoint.info[type].coef || 1)
      // TODO: update mean
      return { pointid: cPoint.id, author, value, type, created }
    })
    return knex(TNAMES.CONSUMPTIONSTATE).insert(data)
  }

  async function createDataManual (devid, body, UID) {
    const cond = { id: devid }
    const cPoint = await knex(TNAMES.CONSUMPTIONPOINT).where(cond).first()
    if (!cPoint) throw new Error(404)
    const prj = await _insertData(cPoint, body, UID)
    return prj
  }

  async function createDataAuto (body) {
    const cond = _.pick(body, 'app_id', 'dev_id')
    const cPoint = await knex(TNAMES.CONSUMPTIONPOINT).where(cond).first()
    if (!cPoint) throw new Error(404)
    const prj = await _insertData(cPoint, body.payload_fields, null, body.time)
    return prj
  }

  app.post('/:id', auth.required, JSONBodyParser, (req, res, next) => {
    createDataManual(req.params.id, req.body, auth.getUID(req))
      .then(createdid => (res.json(createdid)))
      .catch(next)
  })
  app.post('/', JSONBodyParser, (req, res, next) => {
    createDataAuto(req.body).then(created => (res.json(created))).catch(next)
  })

  return app
}
