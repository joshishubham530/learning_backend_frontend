import request from 'supertest'

import createServer from '../../app'

let server: any
beforeAll(async () => {
  server = createServer()
})

describe('POST /emp_signup', () => {
  it('It should return 201 created status', async () => {
    const response = await request(server).post('/emp_signup').send({
      firstName: '}{-=123',
      lastName: '[]=-321',
      type: 'HR',
      email: 'qqaat@qqqq.www',
      phone: 332299999,
      password: '12345',
      organization: 'WITS',
    })
    expect(response.status).toBe(201)
  })
})
