import app from "../../../config/app";
import request from "supertest";
import UserRepository from "../../../repository/user-repository";
import BcryptPasswordHasher from "../../../services/password-hasher/bcrypt-password-hasher";
import { FixerHttpRequest } from "../../../services/request/fixer-http-request";

const ph = new BcryptPasswordHasher();

const hashPassword = ph.hash("correct");


jest.mock('../../../repository/item-repository', () => {
    return {
        findAll: jest.fn().mockImplementation(async () => Promise.resolve([
            {
                "_id": "64345e007e1e0c3b54971b1a",
                "title": "the title",
                "description": "example description",
                "category": {
                    "_id": "64345e007e1e0c3b54971b19",
                    "name": "Appetizer"
                },
                "cost": 8
            }
        ]))
    };
});

const getUserByEmailMock = jest
    .spyOn(UserRepository.prototype, 'getUserByEmail')
    .mockImplementation(async () => {
        return Promise.resolve({ id: "1", username: "Bob", email: 'v@r.com', password: await hashPassword });
    });


const getLatestFixerMock = jest
    .spyOn(FixerHttpRequest.prototype, 'getLatest')
    .mockImplementation(async () => {
        return Promise.resolve({ success: true, rates: { 'JPY': 100 } });
    });

const ITEM_API = '/api/v1/item';
describe('item', () => {

    beforeEach(() => {
        // Clears the record of calls to the mock constructor function and its methods
        getUserByEmailMock.mockClear();
        getLatestFixerMock.mockClear();
    });

    describe('get: Get items', () => {
        it('should successfully get all the items with token', async () => {
            const res = await request(app).get(ITEM_API)
                .send();


            expect(res.status).toEqual(200);
            expect(res.body.success).toBeTruthy();
            expect(res.body.data.length).toEqual(1);
            expect(res.body.data[0]._id).toEqual('64345e007e1e0c3b54971b1a');
            expect(res.body.data[0].category._id).toEqual('64345e007e1e0c3b54971b19');
        });
    })
});