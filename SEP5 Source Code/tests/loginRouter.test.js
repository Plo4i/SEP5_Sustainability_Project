const request = require('supertest');
const app = require('../app'); // Import your Express app

describe('Login routes', () => {
    it('GET / should render the login page', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });

    it('POST / should return success message when login is successful', async () => {
        const mockUser = { username: 'testuser', password: 'testpassword' };

        const response = await request(app)
            .post('/')
            .send(mockUser);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ success: true });
    });

    it('POST / should return error message when username is invalid', async () => {
        const mockUser = { username: 'invaliduser', password: 'testpassword' };

        const response = await request(app)
            .post('/')
            .send(mockUser);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid username' });
    });

    it('POST / should return error message when password is invalid', async () => {
        const mockUser = { username: 'testuser', password: 'invalidpassword' };

        const response = await request(app)
            .post('/')
            .send(mockUser);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid password' });
    });
});