import path from 'path'
import express from 'express'
import dbinit from './dbinit'
import { APIError } from 'modularni-urad-utils'
import { attachPaginate } from 'knex-paginate'
import SessionServiceMock from 'modularni-urad-utils/test/mocks/sessionService'

module.exports = (g) => {
  process.env.DATABASE_URL = ':memory:'
  process.env.NODE_ENV = 'test'
  process.env.SESSION_SERVICE_PORT = 24000
  process.env.SESSION_SERVICE = `http://localhost:${process.env.SESSION_SERVICE_PORT}`

  const port = process.env.PORT || 3333
  Object.assign(g, {
    port,
    baseurl: `http://localhost:${port}`,
    mockUser: { id: 42 },
    sessionBasket: []
  })
  g.sessionSrvcMock = SessionServiceMock(process.env.SESSION_SERVICE_PORT, g)

  g.InitApp = async function (ApiModule) {
    const auth = require('modularni-urad-utils/auth').default
    const knex = await dbinit()
    attachPaginate()
    await ApiModule.migrateDB(knex)

    const app = express()
    const appContext = { 
      express, knex, auth, 
      bodyParser: express.json(),
      ErrorClass: APIError
    }
    const mwarez = ApiModule.init(appContext)
    app.use(mwarez)

    app.use((error, req, res, next) => {
      if (error instanceof APIError) {
        return res.status(error.name).send(error.message)
      }
      console.error(error)
      res.status(500).send(error.message || error.toString())
    })

    return new Promise((resolve, reject) => {
      g.server = app.listen(port, '127.0.0.1', (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  g.close = async function() {
    g.sessionSrvcMock.close()
    g.server.close()
  }
}