const chai = require('chai');
const { expect, request } = require('chai');

const Database = require('../../database/database');
const orderModel = require('../../models/orderModel');
const userModel = require('../../models/userModel');

describe('Testing order models', () => {
	before(async () => {
		await Database.connect();
	});

	after(async () => {
		await Database.connect();
	});

	beforeEach('', async function () {
		await orderModel.clear();
		await userModel.clear();
	});

	it('should create a new order', async function () {
		let order = {
			items: [4, 56, 77],
			orderValue: 399,
		};

		const newOrder = await orderModel.createOrder(order);
		expect(newOrder).to.be.an('object');
		expect(newOrder).to.deep.include({ items: order.items, orderValue: order.orderValue });
		expect(newOrder.items).to.have.lengthOf(order.items.length);
		expect(newOrder.orderValue).to.be.equal(order.orderValue);
	});

	it('Should update a user and add new order to orderHistory', async function () {
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
			orderHistory: [],
		};

		const order = {
			items: [45, 77],
			orderValue: 649,
		};

		const order2 = {
			items: [564, 222],
			orderValue: 1000,
		};

		const user = await userModel.signup(person);
		const newOrder = await orderModel.createOrder(order);
		await userModel.updateOrderHistory(user._id, newOrder._id);

		const newOrder2 = await orderModel.createOrder(order2);
		const updateUser = await userModel.updateOrderHistory(user._id, newOrder2._id);

		expect(newOrder).to.be.an('object');
		expect(newOrder._doc).to.have.keys('items', '_id', 'timestamp', 'status', 'orderValue', '__v');
		expect(updateUser.orderHistory).to.have.lengthOf(2);
		expect(updateUser.orderHistory).to.include(newOrder._id, newOrder2._id);
	});

	it('Should return all orders for logged in user', async function () {
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
			orderHistory: [],
		};

		const order = {
			items: [45, 77],
			orderValue: 649,
		};

		const order2 = {
			items: [564, 222],
			orderValue: 1000,
		};

		const user = await userModel.signup(person);
		const newOrder = await orderModel.createOrder(order);
		const newOrder2 = await orderModel.createOrder(order2);
		await userModel.updateOrderHistory(user._id, newOrder._id);
		await userModel.updateOrderHistory(user._id, newOrder2._id);

		const orders = await userModel.getOrderHistory(user._id);
		expect(orders).to.be.a('array');
		expect(orders.length).to.equal(2);
	});
});
