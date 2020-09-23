const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const { expect, request } = require('chai');

const Database = require('../../database/database');
const userModel = require('../../models/userModel');
const app = require('../../app');

describe('Integration for User', function () {
	before(async () => {
		try {
			await Database.connect();
		} catch (error) {
			console.log(error);
		}
	});

	beforeEach(async function () {
		await userModel.clear();
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
		this.currentTest.user = person;
	});

	after(async () => {
		try {
			await Database.disconnect();
		} catch (error) {
			console.log(error);
		}
	});

	it('POST /api/register should create a user', async function () {
		const resp = await request(app)
			.post('/api/register')
			.set('Content-Type', 'application/json')
			.send(this.test.user);
		expect(resp).to.be.json;
		expect(resp).to.have.status(201);
		expect(resp.body.user).to.include.keys([
			'_id',
			'email',
			'password',
			'name',
			'role',
			'adress',
			'orderHistory',
		]);
		expect(resp.body.user).to.include({
			email: 'pepito@mail.com',
			name: 'Pepito Perez',
			role: 'customer',
		});
		expect(resp.body.user.adress).to.include({
			street: 'Corazongatan 3',
			zip: '123 56',
			city: 'SuperCity',
		});
		expect(resp.body.user.password).to.not.equal('12345');
	});

	it('POST /api/auth should login a user', async function () {
		const body = {
			email: 'pepito@mail.com',
			password: '12345',
		};

		await request(app)
			.post('/api/auth')
			.set('Content-Type', 'application/json')
			.send(body)
			.then((res) => {
				expect(res).to.have.status(200);
				expect(res.body.token).to.be.a('string');
			});
	});

	it('POST /api/auth should return wrong email', async function () {
		const body = {
			email: 'pep@mail.com',
			password: '12345',
		};

		await request(app)
			.post('/api/auth')
			.set('Content-Type', 'application/json')
			.send(body)
			.then((res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.be.a('object');
				expect(res.body).to.include({
					message: 'Email not found',
				});
			});
	});

	it('POST /api/auth should return password not correct', async function () {
		const body = {
			email: 'pepito@mail.com',
			password: '321',
		};

		await request(app)
			.post('/api/auth')
			.set('Content-Type', 'application/json')
			.send(body)
			.then((res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.be.a('object');
				expect(res.body).to.include({
					message: 'Password not correct',
				});
			});
	});
});
