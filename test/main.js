import chai from 'chai'
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
chai.should()

const g = { chai }
require('./env/init')(g)

describe('app', () => {
  before(() => {
    const InitModule = require('../index')
    return g.InitApp(InitModule)
  })
  after(g.close)

  describe('API', () => {
    //
    const submodules = [
      './suites/points',
      './suites/state'
    ]
    submodules.map((i) => {
      const subMod = require(i)
      subMod(g)
    })
  })
})
