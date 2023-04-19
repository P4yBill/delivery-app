
  
## **Delivery app**

**Requirements**: docker, docker-compose
#### **Stack**:
- Nginx
- Node.js, Express
- Mongo database
- JWT Authentication (Only login page)
	- Access token
- Redis

#### Run the app
- In order to run the app:
1. Include a `.env` file (or rename `example.env` to `.env`)
2. `$ docker-compose build`
3. `$ docker-compose up`
4. Visit `http://localhost`

#### App Details
- **Redis** is used to cache Fixer.io currency rates.
- **Mongo** is seeded with a dummy container(which exits after seeding). You can check the dummy json files under **`mongo-seed`** folder
	- Credentials for dummy user:
		- `email: test@g.com`
		- `password: testpass`
- **Nginx** acts as a reverse proxy to serve 2 html pages and the application server:
	1. `/`: Public simple html page for viewing items and submit orders
	2. `/merchant`: Merchant simple html page that requires login in order to view all the orders.
	3. `/api` & `/login`: A request with these paths is passed to the Node.js application server.



### Node.js app ( `api` folder)
#### Run
1. Include a `.env` file (or rename `example.env` to `.env`) in the `api` folder
2. Make sure you have `mongo` , `redis` configured and necessary  `env` variables are included.
3. Run `$ yarn build`
4. Run `$ yarn start` to start the app or `$ yarn start:dev` to watch also for changes.

#### Tests
- Tests are made with `jest` and `supertest` for requests.
- To run the tests:
	- `$ yarn test`
- To output coverage:
	- `$ yarn test:coverage`
- Todo: implement more tests.

#### Linting
- Eslint is used: `$ yarn lint`
- Fix disabled rules

#### Env variables
- Some `.env` config variables:
	- `PORT` : Port of the api app
	- `ACCESS_TOKEN_EXPIRY_HOUR`: Access token expire in hours, `default: 15`
	- `ACCESS_TOKEN_SECRET`: Secret of access token
	- `FIXER_ACCESS_KEY`: Api key for fixer.io
	- `REDIS_FIXER_CACHE_EXPIRE`: Fixer currency rates cache expiration in seconds
		`default: 86400` `= 1day`
- Check all config variables in `api/example.env` file

# Pages

- `/` : Page for viewing items and submit orders
- `/merchant`: After authentication, users can view all the orders.



# Api Documention
- Postman Documentation: https://documenter.getpostman.com/view/10727988/2s93Y2SMVu

### Auth
---

- **POST** `/login` - Logins user.
 	- **Content-Type:** `x-www-form-urlencoded`
	- **Params**: 
		- `email` `Required` 
				  - *Description:* Email of the user
				  - *Validation:* `Email` 
				  - *Type*: `string`

		- `password` `Required` 
				  - *Description:* Password of the user 
				  - *Type*: `string`

	- **Response Status:**
		- 400 - Bad Request - If params were invalid.
		- 500 - Internal Server error - Something went wrong with retrieving the user.
		- 200 - OK - If login successfully.

	- **Response Content-Type:** `application/json`
		- Containing token information
---
### Item Routes
---
- **GET** `/api/v1/item` - Gets all the items
	- **Query Parameters**: 
		- **`currency`** `Optional` 
				  - *Description:* Adds also the currency rate to the response
				  - *Validation:* `Characters: 3` 
				  - *Type*: `string`
	- **Response Status:**
		- 400 - Bad Request - If there was a validation error, i.e. invalid currency.
		- 500 - Internal Server Error - If there was something wrong with fixer api or the database.
		- 200- OK - If response was successful.
	- **Response Content-Type:** `application/json`
---
### Order Routes
---
- **POST** `/api/v1/order` - Creates an order
	- **Params:** 
		- `userEmail` `Required` 
				  - *Description:* Indicates the user that submitted the order
				  - *Validation:* `email` 
				  - *Type*: `string`

		- `targetCurrency` `Optional` 
			  - *Description:* The currency that the order was submitted in.
			  - *Validation:*  `Characters: 3`
			  - *Type*: `string`

		- `items` `Required` 
			  - *Description:* The array of items
			  - *Type*: `Array of item objects` `Item`: `{ id: string, quantity: number}`
			 
	- **Response Status:**
		- 400 - Bad Request  - Validation error, i.e. invalid `items` or `userEmail`.
		- 500 - Internal Server Error - Something went wrong, `Fixer.io` request error or database error.
		- 201 - Created - Order was successfully created.
	
	- **Response Content-Type:** `application/json`
	- **Successful Response** - `{ "success": true, "id": <id_of_created_order> }`
---
- **GET** `/api/v1/order` **`REQUIRES AUTH`**- Gets all the orders sorted by date.
	- **Response Status:**
		 - 400 - Bad Request - Something went wrong.
		- 200 - OK - Successful request.
