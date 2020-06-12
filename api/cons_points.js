import { TNAMES } from '../consts'
import { whereFilter } from 'knex-filter-loopback'
import _ from 'underscore'

export default (ctx) => {
  const { knex, auth, JSONBodyParser } = ctx
  const app = ctx.express()

  app.get('/', (req, res, next) => {
    knex(TNAMES.CONSUMPTIONPOINT).where(whereFilter(req.query)).then(info => {
      res.json(info)
      next()
    }).catch(next)
  })

  const editables = ['app_id', 'dev_id', 'info', 'desc', 'lat', 'lng', 'alt']

  app.post('/', auth.required, JSONBodyParser, (req, res, next) => {
    req.body = _.pick(req.body, editables)
    knex(TNAMES.CONSUMPTIONPOINT).returning('id').insert(req.body)
      .then(savedid => {
        res.status(201).json(savedid)
        next()
      })
      .catch(next)
  })

  app.put('/:id([0-9]+)', auth.required, JSONBodyParser, async (req, res, next) => {
    try {
      req.body = _.pick(req.body, editables)
      await knex(TNAMES.CONSUMPTIONPOINT).where({ id: req.params.id })
        .update(req.body)
      res.json(req.body)
    } catch (err) {
      next(err)
    }
  })

  return app
}
