const request = require('supertest');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = require('../app');
const { contacts, user, newContact } = require('../src/model/__mocks__/data');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const generateToken = (payload, secret) => jwt.sign(payload, secret);
const token = generateToken({ id: user._id }, JWT_SECRET_KEY);
user.token = token;

jest.mock('../src/model/contacts.js');
jest.mock('../src/model/users.js');

describe('Testing api/contacts route', () => {
  let newContactId = null;
  describe('shoud handle GET request', () => {
    test('should return 200 status for GET:/contacts', async () => {
      const res = await request(app)
        .get('/api/contacts')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body.allContacts).toBeInstanceOf(Array);
    });

    test('should return 200 status for GET:/contacts/:contactId', async () => {
      const [contact] = contacts;
      const res = await request(app)
        .get(`/api/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body.contact_id).toBe(contact.id);
    });

    test('should return 404 status for GET:/contacts/:contactId', async () => {
      const res = await request(app)
        .get('/api/contacts/5fdf16b0f01fc55058aa67bb')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(404);
      expect(res.body).toBeDefined();
    });

    test('should return 400 status for GET:/contacts/:contactId', async () => {
      const res = await request(app)
        .get(`/api/contacts/60df16b0f01fb8aa67be`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });
  });

  describe('shoud handle POST request', () => {
    test('should return 201 status for POST:/contacts', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application / json')
        .send(newContact);
      expect(res.status).toEqual(201);
      expect(res.body).toBeDefined();
      expect(res.body.newContact).toBeInstanceOf(Object);
      newContactId = res.body.newContact._id;
    });

    test('should return 400 status for POST:/contacts in case not allowed field', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application / json')
        .send({ ...newContact, text: 'some text' });
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });

    test('should return 400 status for POST:/contacts in case missing allowed fields', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application / json')
        .send({ email: 'test@mail.com' });
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });

    test('should return 400 status for POST:/contacts in case empty request object', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application / json')
        .send({});
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });
  });

  describe('shoud handle PUT request', () => {
    test('should return 200 status for PUT/contacts/:contactId', async () => {
      const res = await request(app)
        .put(`/api/contacts/${newContactId}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application / json')
        .send(newContact);
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body.updatedContact.name).toEqual(newContact.name);
    });

    test('should return 400 status for PUT/contacts/:contactId in case not allowed field', async () => {
      const res = await request(app)
        .put(`/api/contacts/${newContactId}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application / json')
        .send({ ...newContact, text: 'some text' });
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });

    test('should return 400 status for PUT/contacts/:contactId in case missing allowed fields', async () => {
      const res = await request(app)
        .put(`/api/contacts/${newContactId}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application / json')
        .send({ email: 'test@mail.com' });
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });

    test('should return 400 status for PUT/contacts/:contactId in case empty request object', async () => {
      const res = await request(app)
        .put(`/api/contacts/${newContactId}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application / json')
        .send({});
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });

    test('should return 404 status for PUT/contacts/:contactId', async () => {
      const res = await request(app)
        .put('/api/contacts/5fdf16b0f01fc55058aa67bb')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application / json')
        .send(newContact);
      expect(res.status).toEqual(404);
      expect(res.body).toBeDefined();
    });
  });

  describe('shoud handle PATCH request', () => {
    test('should return 200 status for PATCH/contacts/:contactId/favorite', async () => {
      const res = await request(app)
        .patch(`/api/contacts/${newContactId}/favorite`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application / json')
        .send({ favorite: true });
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body.updatedContact.name).toEqual(newContact.name);
    });

    test('should return 400 status for PATCH/contacts/:contactId/favorite in case not allowed field', async () => {
      const res = await request(app)
        .patch(`/api/contacts/${newContactId}/favorite`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application / json')
        .send({ favorite: true, text: 'some text' });
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });

    test('should return 400 status for PATCH/contacts/:contactId/favorite in case missing favorite field', async () => {
      const res = await request(app)
        .patch(`/api/contacts/${newContactId}/favorite`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application / json')
        .send({});
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });

    test('should return 404 status for PATCH/contacts/:contactId/favorite', async () => {
      const res = await request(app)
        .patch('/api/contacts/5fdf16b0f01fc55058aa67bb/favorite')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application / json')
        .send({ favorite: true });
      expect(res.status).toEqual(404);
      expect(res.body).toBeDefined();
    });
  });

  describe('shoud handle DELETE request', () => {
    test('should return 200 status for DELETE/contacts/:contactId', async () => {
      const res = await request(app)
        .delete(`/api/contacts/${newContactId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
    });

    test('should return 404 status for DELETE/contacts/:contactId', async () => {
      const res = await request(app)
        .delete('/api/contacts/5fdf16b0f01fc55058aa67bb')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(404);
      expect(res.body).toBeDefined();
    });
  });
});
