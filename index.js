import initPointRoutes from './api/cons_points'
import initStateRoutes from './api/cons_state'

export default (ctx) => {
  const app = ctx.express()

  app.use('/points', initPointRoutes(ctx))
  app.use('/state', initStateRoutes(ctx))

  return app
}
