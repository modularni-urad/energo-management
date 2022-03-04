import MWarez from './cons_points.js'
import StateMWarez from './cons_state.js'

export default (ctx) => {
  const { auth, bodyParser } = ctx
  const app = ctx.express()
  const MW = MWarez(ctx)
  const StateMW = StateMWarez(ctx)

  // state
  app.post('/state/:id', auth.session, auth.required, bodyParser, (req, res, next) => {
    StateMW.create(req.params.id, req.body, auth.getUID(req), req.tenantid)
      .then(created => (res.json(created)))
      .catch(next)
  })
  app.get('/state', (req, res, next) => {
    StateMW.list(req.query, req.tenantid).then(found => res.json(found)).catch(next)
  })

  // points
  app.get('/', (req, res, next) => {
    MW.list(req.query, req.tenantid).then(found => res.json(found)).catch(next)
  })

  app.post('/', auth.session, auth.required, bodyParser, (req, res, next) => {
    MW.create(req.body, req.user, req.tenantid).then(created => {
      res.json(created)
    }).catch(next)
  })

  app.put('/:id([0-9]+)', auth.session, auth.required, bodyParser, (req, res, next) => {
    MW.update(req.params.id, req.body, req.user, req.tenantid).then(val => {
      res.json(val)
    }).catch(next)
  })

  return app
}
