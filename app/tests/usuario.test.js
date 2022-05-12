const supertest = require('supertest');
console.log('supertest');
const app = require('../../main');
console.log('app');

describe('GET Users', () => {
  test('Should return users', async () => {
    const res = await supertest(app)
      .get('/api/v1.0/users/')
      .send()
    expect(res.statusCode).toEqual(200)
  },10000)
})

describe('GET Login', () => {
  test('Should return users', async () => {
    const res = await supertest(app)
      .post('/api/v1.0/users/login')
      .send({email:'raphaelkonichi@gmail.com', password:'frutifeira123'})
    expect(res.statusCode).toEqual(200)
  },10000)
})

describe('GET users by name', () => {
  test('Should return users', async () => {
    const res = await supertest(app)
      .get('/api/v1.0/users/nome/Rapha')
      .send()
    expect(res.statusCode).toEqual(200)
  },10000)
})

describe('GET users by email', () => {
  test('Should return users', async () => {
    const res = await supertest(app)
      .get('/api/v1.0/users/nome/raph')
      .send()
    expect(res.statusCode).toEqual(200)
  },10000)
})