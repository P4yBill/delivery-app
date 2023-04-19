import ItemRepository from "../../repository/item-repository";
import OrderRepository from "../../repository/order-repository";
import { FixerHttpRequest } from "../../services/request/fixer-http-request";
import OrderUsecase from "../../usecase/order-usecase";



jest.mock('../../repository/item-repository', () => {
    return {
        find: jest.fn().mockImplementation(async () => Promise.resolve([
            {
                "id": "64345e007e1e0c3b54971b1a",
                "title": "the title",
                "description": "example description",
                "category": {
                    "_id": "64345e007e1e0c3b54971b19",
                    "name": "Appetizer"
                },
                "cost": 8
            }
        ])),
    };
});

jest.mock('../../repository/order-repository', () => {
    return {
        insertOne: jest.fn().mockImplementation(async () => {
            return Promise.resolve("643d5ec7e8808f082096d6e6");
        }),
        findAll: jest.fn().mockImplementation(async () => Promise.resolve([
            {
                "status": "Pending",
                "id": "64345e007e1e0c3b54971b1b",
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

const getLatestFixerMock = jest
    .spyOn(FixerHttpRequest.prototype, 'getLatest')
    .mockImplementation(async () => {
        return Promise.resolve({ success: true, rates: { 'JPY': 100 } });
    });

describe('order:usecase', () => {
    const MockedOrderRepository = jest.mocked(OrderRepository, { shallow: true });
    const MockedItemRepository = jest.mocked(ItemRepository, { shallow: true });

    let orderUsecase: OrderUsecase;

    beforeEach(() => {
        // Clears the record of calls to the mock constructor function and its methods
        getLatestFixerMock.mockClear();
    });

    beforeAll(() => {
        orderUsecase = new OrderUsecase();
    });

    describe('getAllOrders', () => {
        it('should successfully get all the items', async () => {
            const orders = await orderUsecase.getAllOrders();

            expect(MockedOrderRepository.findAll).toHaveBeenCalled();
            expect((<any>orders[0]).id).toEqual('64345e007e1e0c3b54971b1b');
        });
    });

    describe('createOrder', () => {
        it('should successfully create an order without currency', async () => {
            const jsonBody = {
                userEmail: "test@g.com",
                items: [
                    {
                        item: "64345e007e1e0c3b54971b1a",
                        quantity: 3
                    }

                ]
            };
            const id = await orderUsecase.createOrder(jsonBody);

            expect(MockedOrderRepository.insertOne).toHaveBeenCalled();
            expect(id).toEqual('643d5ec7e8808f082096d6e6');
            expect(getLatestFixerMock).not.toHaveBeenCalled();
        });

        it('should search items through item repository with correct filter', async () => {
            const jsonBody = {
                userEmail: "test@g.com",
                items: [
                    {
                        item: "64345e007e1e0c3b54971b1a",
                        quantity: 3
                    }

                ]
            };
            await orderUsecase.createOrder(jsonBody);

            expect(MockedItemRepository.find).toHaveBeenCalledWith({ _id: { $in: ["64345e007e1e0c3b54971b1a"] } });

        });


        it('should not request currency rates from fixer with a EUR target currency', async () => {
            const jsonBody = {
                "userEmail": "test@g.com",
                "targetCurrency": "EUR",
                "items": [
                    {
                        "item": "64345e007e1e0c3b54971b1a",
                        "quantity": 3
                    }
                ]
            };
            await orderUsecase.createOrder(jsonBody);

            expect(getLatestFixerMock).not.toHaveBeenCalled();
        });

        it('should also request currency rates from fixer if valid target currency given', async () => {
            const jsonBody = {
                "userEmail": "test@g.com",
                "targetCurrency": "JPY",
                "items": [
                    {
                        "item": "64345e007e1e0c3b54971b1a",
                        "quantity": 3
                    }
                ]
            };
            await orderUsecase.createOrder(jsonBody);

            expect(getLatestFixerMock).toHaveBeenCalled();
        });
    });
});