import request from 'supertest';
import app from '../app.js';

describe('POST /api/auth/login', () => {
  it('debería responder con error si las credenciales son incorrectas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'usuario-falso@example.com',
        password: 'wrongpass'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.isSuccess).toBe(false);
    expect(res.body.message).toBe('Credenciales incorrectas');
  });
});
