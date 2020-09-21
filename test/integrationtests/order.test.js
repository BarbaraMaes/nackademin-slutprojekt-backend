const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const Database = require('../../database/database');
const userModel = require('../../models/userModel');
const app = require('../../app');

const { expect, request } = require('chai');

describe.only('Integration for Order', function () {
	before(async () => {
		try {
			await Database.connect();
		} catch (error) {
			console.log(error);
		}
	});

	beforeEach(async function () {
		await userModel.clear();
		//await orderModel.clear();

        
		// console.log(this.currentTest.user);
		// console.log(this.currentTest.token);
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
                console.log(res.body)
				//console.log(res.body);
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
				//console.log(res.body);
			});
	});
});
