const request = require('supertest');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fs = require('fs/promises');
const app = require('../app');
const { user, newUser } = require('../src/model/__mocks__/data');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const generateToken = (payload, secret) => jwt.sign(payload, secret);
const token = generateToken({ id: user._id }, JWT_SECRET_KEY);
user.token = token;

jest.mock('../src/model/contacts.js');
jest.mock('../src/model/users.js');

describe('Testing api/users route', () => {
  describe('should handle POST request', () => {
    test('should return 201 POST: /api/users/signup', async () => {
      const res = await request(app).post('/api/users/signup').send(newUser);
      expect(res.status).toEqual(201);
      expect(res.body).toBeDefined();
    });

    test('should return 409 POST: /api/users/signup', async () => {
      const res = await request(app).post('/api/users/signup').send(newUser);
      expect(res.status).toEqual(409);
      expect(res.body).toBeDefined();
    });

    test('should return 200 POST: /api/users/login', async () => {
      const res = await request(app).post('/api/users/login').send(newUser);
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
    });

    test('should return 401 POST: /api/users/login', async () => {
      const res = await request(app).post('/api/users/login').send({
        email: 'someEmail@mail.com',
        password: 'password',
      });
      expect(res.status).toEqual(401);
      expect(res.body).toBeDefined();
    });
    test('should return 204 POST: /api/users/logout', async () => {
      const res = await request(app)
        .post('/api/users/logout')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(204);
      expect(res.body).toBeDefined();
    });

    test('should return 401 POST: /api/users/logout', async () => {
      const res = await request(app).post('/api/users/logout');
      expect(res.status).toEqual(401);
      expect(res.body).toBeDefined();
    });
  });

  describe('should handle PATCH request', () => {
    test('should return 200 status for PATCH: api/users/subscription', async () => {
      const res = await request(app)
        .patch('/api/users/subscription')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application / json')
        .send({ subscription: 'pro' });
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
    });

    test('should return 400 status for PATCH: api/users/subscription in case not allowed field', async () => {
      const res = await request(app)
        .patch('/api/users/subscription')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ subscription: 'pro', text: 'some text' });
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });

    test('should return 400 status for PATCH: api/users/subscription in case missing subscription field', async () => {
      const res = await request(app)
        .patch('/api/users/subscription')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({});
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });

    test('should return 401 status for PATCH/contacts/:contactId/favorite', async () => {
      const res = await request(app)
        .patch('/api/users/subscription')
        .set('Accept', 'application/json')
        .send({ favorite: true });
      expect(res.status).toEqual(401);
      expect(res.body).toBeDefined();
    });

    test('should return 200 status for PATCH: /users/avatars', async () => {
      const buffer = await fs.readFile('./__tests__/Avatar2.jpg');
      const res = await request(app)
        .patch('/api/users/avatars')
        .set('Authorization', `Bearer ${token}`)
        .attach('avatar', buffer, 'Avatar2.jpg');
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body.avatarURL).toEqual('new avatar url');
    });
  });
});
