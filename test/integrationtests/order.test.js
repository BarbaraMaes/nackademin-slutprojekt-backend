const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const Database = require('../../database/database');
const userModel = require('../../models/userModel');
const orderModel = require('../../models/orderModel');
const app = require('../../app');

const { expect, request } = require('chai');

describe('Integration for Order', function () {
	before(async () => {
		try {
			await Database.connect();
		} catch (error) {
			console.log(error);
		}
	});

	beforeEach(async function () {
		await userModel.clear();
		await orderModel.clear();
	});

	after(async () => {
		try {
			await Database.disconnect();
		} catch (error) {
			console.log(error);
		}
	});

	it('POST /api/orders should create a order with authenticated user', async function () {
		const body = {
			items: [3, 5, 1],
			orderValue: 399,
		};

		const person = {
			email: 'pepito@mail.com',
			password: '12345',
			name: 'Pepito Perez',
			role: 'customer',
			adress: {
				street: 'Corazongatan 3',
				zip: '123 56',
				city: 'SuperCity',
			},
		};

		await userModel.signup(person);
		const login = await userModel.login('pepito@mail.com', '12345');

		await request(app)
			.post('/api/orders')
			.set('Authorization', 'Bearer ' + login.token)
			.send(body)
			.then((res) => {
				expect(res.body).to.be.an('object');
				expect(res.body).to.have.status('inProcess');
				expect(res.body._id).to.be.a('string');
			});
	});

	it('POST /api/orders should create a order with anonymous user', async function () {
		const body = {
			items: [3, 5, 1],
			orderValue: 399,
		};

		await request(app)
			.post('/api/orders')
			.set('Content-Type', 'application/json')
			.send(body)
			.then((res) => {
				expect(res.body).to.be.an('object');
				expect(res.body).to.have.status('inProcess');
				expect(res.body._id).to.be.a('string');
			});
	});

	it('GET /api/orders/ should return all orders for a user', async function () {
		const person = {
			email: 'pepito@mail.com',
			password: '12345',
			name: 'Pepito Perez',
			role: 'customer',
			adress: {
				street: 'Corazongatan 3',
				zip: '123 56',
				city: 'SuperCity',
			},
		};

		const user = await userModel.signup(person);
		const login = await userModel.login('pepito@mail.com', '12345');

		const order = {
			items: [45, 77],
			orderValue: 649,
		};

		const order2 = {
			items: [564, 222],
			orderValue: 1000,
		};

		const newOrder = await orderModel.createOrder(order);
		const newOrder2 = await orderModel.createOrder(order2);
		await userModel.updateOrderHistory(user._id, newOrder._id);
		await userModel.updateOrderHistory(user._id, newOrder2._id);

		await request(app)
			.get('/api/orders')
			.set('Authorization', 'Bearer ' + login.token)
			.then((res) => {
				expect(res.body).to.be.an('array');
				expect(res).to.have.status(200);
			});
	});
	it('GET /api/orders/ should return all orders for a user', async function () {
		const person = {
			email: 'pepito@mail.com',
			password: '12345',
			name: 'Pepito Perez',
			role: 'customer',
			adress: {
				street: 'Corazongatan 3',
				zip: '123 56',
				city: 'SuperCity',
			},
		};
		const admin = {
			email: 'test@mail.com',
			password: '12345',
			name: 'Pepito Perez',
			role: 'admin',
			adress: {
				street: 'Corazongatan 3',
				zip: '123 56',
				city: 'SuperCity',
			},
		};

		const user = await userModel.signup(person);
		await userModel.signup(admin);
		const login = await userModel.login('test@mail.com', '12345');

		const order = {
			items: [45, 77],
			orderValue: 649,
		};

		const order2 = {
			items: [564, 222],
			orderValue: 1000,
		};

		const newOrder = await orderModel.createOrder(order);
		const newOrder2 = await orderModel.createOrder(order2);
		await userModel.updateOrderHistory(user._id, newOrder._id);
		await userModel.updateOrderHistory(user._id, newOrder2._id);

		await request(app)
			.get('/api/orders')
			.set('Authorization', 'Bearer ' + login.token)
			.then((res) => {
				expect(res.body).to.be.an('array');
				expect(res).to.have.status(200);
			});
	});
});
