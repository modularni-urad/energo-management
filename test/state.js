/* global describe it */
const chai = require('chai')
// const should = chai.should()
// import _ from 'underscore'

module.exports = (g) => {
  //
  const r = chai.request(g.baseurl)

  const data = {
    app_id: 'app1',
    dev_id: 'p1',
    payload_fields: {
      watr: 983436,
      batt: 3.54
    },
    time: '2020-05-27T11:45:15.141140285Z'
  }

  return describe('state', () => {
    it('must create a new data', async () => {
      const res = await r.post('/state').send(data)
      res.should.have.status(200)
    })
  })
}
