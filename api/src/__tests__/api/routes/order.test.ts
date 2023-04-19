import app from "../../../config/app";
import request from "supertest";
import UserRepository from "../../../repository/user-repository";
import BcryptPasswordHasher from "../../../services/password-hasher/bcrypt-password-hasher";
import OrderRepository from "../../../repository/order-repository";
import { HttpCode } from "../../../utils/http-status-codes";
import ItemRepository from "../../../repository/item-repository";
import { FixerHttpRequest } from "../../../services/request/fixer-http-request";
import { createJwtAccessToken } from "../../../utils/token";

const ph = new BcryptPasswordHasher();

const hashPassword = ph.hash("correct");

jest.mock('../../../repository/order-repository', () => {
    return {
        insertOne: jest.fn().mockImplementation(async () => {
            return Promise.resolve("643d5ec7e8808f082096d6e6");
        }),
        findAll: jest.fn().mockImplementation(async () => Promise.resolve([
            {
                "status": "Pending",
                "_id": "64345e007e1e0c3b54971b1b",
                "user_email": "v@r.com",
                "total_cost": 16,
                "items": [
                    {
                        "item": "64345e007e1e0c3b54971b1a",
                        "title": "Bolonez",
                        "quantity": 2
                    }
                ],
                "created_at": "2023-04-17T15:02:51.264Z"
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

describe('order', () => {
    const MockedOrderRepository = jest.mocked(OrderRepository, { shallow: true });

    beforeEach(() => {
        // Clears the record of calls to the mock constructor function and its methods
        getUserByEmailMock.mockClear();
        getLatestFixerMock.mockClear();
    });

    describe('post: Create order', () => {
        const findItemsMocked = jest
            .spyOn(ItemRepository, 'find')
            .mockImplementation(() => {
                return Promise.resolve(<any>[
                    {
                        "id": "64345e007e1e0c3b54971b1a",
                        "title": "the title",
                        "description": "example description",
                        "category": {
                            "id": "64345e007e1e0c3b54971b19",
                            "name": "Appetizer"
                        },
                        "cost": 8
                    }
                ]);
            });

        it('should send 201, successfully creates an order with valid params and target currency', async () => {
            const res = await request(app).post('/api/v1/order')
                .send({
                    userEmail: "v@g.com",
                    targetCurrency: "JPY",
                    items: [
                        {
                            item: "64345e007e1e0c3b54971b1a",
                            quantity: 3
                        }
                    ]
                });

            const { success, id } = res.body;


            expect(res.status).toEqual(201);
            expect(id).toEqual('643d5ec7e8808f082096d6e6');
            expect(success).toBeTruthy();
            expect(res.statusCode).toEqual(HttpCode.Created);
            expect(MockedOrderRepository.insertOne).toHaveBeenCalled();
            expect(findItemsMocked).toHaveBeenCalled();

            expect(getLatestFixerMock).toHaveBeenCalled();
        });


        it('should send 201, successfully creates an order with valid params and without target currency', async () => {
            const res = await request(app).post('/api/v1/order')
                .send({
                    userEmail: "v@g.com",
                    items: [
                        {
                            item: "64345e007e1e0c3b54971b1a",
                            quantity: 3
                        }
                    ]
                });

            const { success, id } = res.body;


            expect(res.status).toEqual(201);
            expect(id).toEqual('643d5ec7e8808f082096d6e6');
            expect(success).toBeTruthy();
            expect(res.statusCode).toEqual(HttpCode.Created);
            expect(MockedOrderRepository.insertOne).toHaveBeenCalled();
            expect(findItemsMocked).toHaveBeenCalled();

            expect(getLatestFixerMock).not.toHaveBeenCalled();
        });

        it('should send 400 with invalid email', async () => {
            const res = await request(app).post('/api/v1/order')
                .send({
                    userEmail: "v",
                    items: [
                        {
                            item: "64345e007e1e0c3b54971b1a",
                            quantity: 3
                        }
                    ]
                });

            const { success, message } = res.body;


            expect(res.status).toEqual(400);
            expect(message).toBeDefined();
            expect(success).toBeFalsy();
        });

        it('should send 400 without 3 character target currency ', async () => {
            const res = await request(app).post('/api/v1/order')
                .send({
                    userEmail: "v@g.com",
                    targetCurrency: 'HP',
                    items: [
                        {
                            item: "64345e007e1e0c3b54971b1a",
                            quantity: 3
                        }
                    ]
                });

            const { success, message } = res.body;


            expect(res.status).toEqual(400);
            expect(message).toBeDefined();
            expect(success).toBeFalsy();
        });


        it('should send 400 with empty items, empty cart', async () => {
            const res = await request(app).post('/api/v1/order')
                .send({
                    userEmail: "v@g.com",
                    items: []
                });

            const { success, message } = res.body;


            expect(res.status).toEqual(400);
            expect(message).toBeDefined();
            expect(success).toBeFalsy();
        });

        it('should send 400 with invalid object ids', async () => {
            const res = await request(app).post('/api/v1/order')
                .send({
                    userEmail: "v@g.com",
                    items: [
                        {
                            item: "64345e007e1e0c3b54971b1",
                            quantity: 3
                        }
                    ]
                });

            const { success, message } = res.body;


            expect(res.status).toEqual(400);
            expect(message).toBeDefined();
            expect(success).toBeFalsy();
        });


        it('should send 400 with items that do not exist in the database', async () => {
            const res = await request(app).post('/api/v1/order')
                .send({
                    userEmail: "v@g.com",
                    items: [
                        {
                            item: "64345e007e1e0c3b54971b1r",
                            quantity: 3
                        }
                    ]
                });

            const { success, message } = res.body;


            expect(res.status).toEqual(400);
            expect(message).toBeDefined();
            expect(success).toBeFalsy();
        });
    });

    describe('get: Get order', () => {
        it('should send 401, authorized without valid token', async () => {
            const res = await request(app).get('/api/v1/order')
                .send();

            expect(res.status).toEqual(401);
        });

        it('should successfully get all the orders with token', async () => {
            const accessToken = createJwtAccessToken({ id: "1", email: 'v@r.com', password: 'correct', username: "" })
            const res = await request(app).get('/api/v1/order')
                .set("Authorization", 'Bearer ' + accessToken)
                .send();

            expect(res.status).toEqual(200);
            expect(res.body.success).toBeTruthy();
            expect(res.body.data.length).toEqual(1);
            expect(res.body.data[0]._id).toEqual('64345e007e1e0c3b54971b1b');
        });
    })
});