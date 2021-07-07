const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { authGuard } = require('../src/middlewares/authMiddleware');
const { statusCode } = require('../src/helpers/constants');
const { CustomError } = require('../src/helpers/errors');
const { user } = require('../src/model/__mocks__/data');
const { getUserById } = require('../src/model/__mocks__/users');
jest.mock('../src/model/users.js');

describe('Auth middleware test', () => {
  afterEach(() => (user.token = null));
  test('should call next(), get user from DB and add user property to req object', async () => {
    const generateToken = (payload, secret) => jwt.sign(payload, secret);
    const token = generateToken({ id: user._id }, JWT_SECRET_KEY);
    user.token = token;
    const mReq = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    const mRes = {};
    const mockNext = jest.fn();
    const userInDb = getUserById(user._id);
    await authGuard(mReq, mRes, mockNext);
    expect(userInDb).toBeTruthy();
    expect(userInDb.token).toEqual(token);
    expect(mReq.user._id).toEqual(userInDb._id);
    expect(mockNext).toHaveBeenCalled();
  });

  test('should call next() with an error in case authorization header is absent', async () => {
    const mReq = {
      headers: {},
    };
    const mRes = {};
    const mockNext = jest.fn();
    await authGuard(mReq, mRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(
      new CustomError(statusCode.UNAUTHORIZED, 'Not authorized')
    );
  });

  test('should call next() with an error in case userInDb is absent', async () => {
    const fakeUser = {
      ...user,
      _id: '1',
    };
    const generateToken = (payload, secret) => jwt.sign(payload, secret);
    const token = generateToken({ id: fakeUser._id }, JWT_SECRET_KEY);
    fakeUser.token = token;
    const mReq = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    const mRes = {};
    const mockNext = jest.fn();
    const userInDb = getUserById(fakeUser._id);
    await authGuard(mReq, mRes, mockNext);
    expect(userInDb).toBeFalsy();
    expect(mockNext).toHaveBeenCalledWith(
      new CustomError(statusCode.UNAUTHORIZED, 'Not authorized')
    );
  });

  test("should call next() with an error in case userInDb's token isn't equal to authorization header token", async () => {
    const generateToken = (payload, secret) => jwt.sign(payload, secret);
    const token = generateToken({ id: user._id }, JWT_SECRET_KEY);
    const mReq = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    const mRes = {};
    const mockNext = jest.fn();
    const userInDb = getUserById(user._id);
    await authGuard(mReq, mRes, mockNext);
    expect(userInDb.token).not.toEqual(token);
    expect(mockNext).toHaveBeenCalledWith(
      new CustomError(statusCode.UNAUTHORIZED, 'Not authorized')
    );
  });

  test('should call next() with an error when call authmiddleware', async () => {
    const generateToken = (payload, secret) => jwt.sign(payload, secret);
    const token = generateToken({ id: user._id }, JWT_SECRET_KEY);
    user.token = token;
    const mReq = {};
    const mRes = {};
    const mockNext = jest.fn();
    await authGuard(mReq, mRes, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith(
      new CustomError(statusCode.UNAUTHORIZED, 'Not authorized')
    );
  });
});
