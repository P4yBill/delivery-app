import app from "../../../config/app";
import request from "supertest";
import Endpoints from "../../../api/route/endpoints";
import UserRepository from "../../../repository/user-repository";
import BcryptPasswordHasher from "../../../services/password-hasher/bcrypt-password-hasher";

const ph = new BcryptPasswordHasher();

const hashPassword = ph.hash("correct");

const getUserByEmailMock = jest
  .spyOn(UserRepository.prototype, 'getUserByEmail')
  .mockImplementation(async () => {
    return Promise.resolve({ id: "1", username: "Bob", email: 'v@r.com', password: await hashPassword });
  });

describe('login', () => {

  beforeEach(() => {
    // Clears the record of calls to the mock constructor function and its methods
    getUserByEmailMock.mockClear();
  });

  it('returns unauthorized with invalid login credentials', async () => {
    const res = await request(app).post(Endpoints.Login).send({ email: 'v@r.com', password: 'wrong' });
    const { message } = res.body;

    expect(getUserByEmailMock).toHaveBeenCalled();
    expect(res.statusCode).toEqual(401);
    expect(message).toEqual('Invalid Credentials')
  });

  it('returns ok response with with user json when login credentials are valid', async () => {
    const res = await request(app).post(Endpoints.Login).send({ email: 'v@r.com', password: 'correct' });
    const { username, access_token, expires_in, token_type } = res.body;

    expect(getUserByEmailMock).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(username).toEqual('Bob');
    expect(access_token).toBeDefined();
    expect(expires_in).toEqual(54000);
    expect(token_type).toEqual('Bearer');
  });
});