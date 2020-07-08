import { TNAMES } from '../consts'
import { whereFilter } from 'knex-filter-loopback'
import _ from 'underscore'

export default (ctx) => {
  const { knex, auth, JSONBodyParser } = ctx
  const app = ctx.express()

  app.get('/', (req, res, next) => {
    const perPage = Number(req.query.perPage) || 10
    const currentPage = Number(req.query.currentPage) || null
    const query = _.omit(req.query, 'currentPage', 'perPage')
    let qb = knex(TNAMES.CONSUMPTIONPOINT).where(whereFilter(query))
    qb = currentPage ? qb.paginate({ perPage, currentPage }) : qb
    qb.then(info => {
      res.json(info)
      next()
    }).catch(next)
  })

  const editables = ['app_id', 'dev_id', 'settings', 'desc', 'lat', 'lng', 'alt']

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
