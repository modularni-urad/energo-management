import { MEDIUMTYPE } from '../../consts'

module.exports = (g) => {
  //
  const r = g.chai.request(g.baseurl)

  const p1 = g.p = {
    ico: '904343',
    buildingid: 'p1',
    desc: 'current sensing device',
    'sensor_sn': 'o10022', 
    'sensor_type': 'pokus', 
    'sensor_id': 33,
    'distributor_id': 333, 
    'device_id': 1, 
    'external_id': 5,
    settings: {
      [MEDIUMTYPE.ELEKTRO]: { coef: 2, start: 10 },
      [MEDIUMTYPE.ELEKTRO_LOW]: { coef: 2, start: 10 }
    }
  }
  function _createPostData () {
    return Object.assign({}, p1, { settings: JSON.stringify(p1.settings) })
  }

  return describe('points', () => {
    
    it('must not create a new item wihout auth', async () => {
      const res = await r.post(`/`).send(p1)
      res.should.have.status(401)
    })

    it('shall create a new item p1', async () => {
      const data = _createPostData()
      const res = await r.post(`/`).send(data).set('Authorization', 'Bearer f')
      res.status.should.equal(200)
    })

    it('shall get the pok1', async () => {
      const res = await r.get('/')
      res.status.should.equal(200)
      res.body.should.have.lengthOf(1)
      res.body[0].sensor_sn.should.equal(p1.sensor_sn)
      p1.id = res.body[0].id
    })

    it('shall update the item pok1', async () => {
      const change = {
        sensor_type: 'voda'
      }
      const res = await r.put(`/${p1.id}`).send(change)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
    })

    it('shall get the pok1', async () => {
      const res = await r.get('/?filter={"sensor_type":"voda"}')
      res.status.should.equal(200)
      res.body.should.have.lengthOf(1)
      res.body[0].desc.should.equal(p1.desc)
    })

  })
}
