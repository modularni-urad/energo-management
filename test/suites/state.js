import { MEDIUMTYPE } from '../../consts'

module.exports = (g) => {
  const r = g.chai.request(g.baseurl)

  const data = {
    dev_id: 'p1',
    [MEDIUMTYPE.ELEKTRO]: 9834,
    [MEDIUMTYPE.ELEKTRO_LOW]: 983436,
    time: '2020-05-27T11:45:15.141140285Z',
    sequence: 1
  }
  const d2 = Object.assign({}, data, { sequence: 2, time: new Date() })

  return describe('state', () => {
    it('must create a new data', async () => {
      const res = await r.post(`/state/${g.p.id}`).send(data)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
    })

    it('must not create same data - same sequence', async () => {
      const res = await r.post(`/state/${g.p.id}`).send(data)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)

      const res2 = await r.get('/state')
      res2.body.should.have.lengthOf(2)
    })

    it('must NOT create a new data - without url param', async () => {
      const res = await r.post(`/state`).send(d2).set('Authorization', 'Bearer f')
      res.should.have.status(400)

      const res2 = await r.get('/state')
      res2.body.should.have.lengthOf(2)
    })

    it('must create same data - without url param BUT id in data', async () => {
      const d = Object.assign({}, d2, { id: g.p.id })
      const res = await r.post(`/state/`).send(d).set('Authorization', 'Bearer f')
      res.should.have.status(200)

      const res2 = await r.get('/state')
      res2.body.should.have.lengthOf(4)
    })

  })
}
