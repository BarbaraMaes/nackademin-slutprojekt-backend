require('dotenv').config();
const chai = require('chai');
const { expect } = require('chai');

const Database = require('../../database/database');
const userModel = require('../../models/userModel');

describe('User model', async function () {
	before(async () => {
		try {
			await Database.connect();
		} catch (error) {
			console.log(error);
		}
	});

	beforeEach(async function () {
		// Clear Database if other tests
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

		const user = await userModel.signup(person);
		this.currentTest.user = user;
	});

	after(async () => {
		try {
			await Database.disconnect();
		} catch (error) {
			console.log(error);
		}
	});

	it('Should create a user', async function () {
		expect(this.test.user).to.be.a('object');
		expect(this.test.user._doc).to.include.all.keys([
			'_id',
			'email',
			'password',
			'name',
			'role',
			'adress',
			'orderHistory',
		]);
		expect(this.test.user.adress).to.have.all.keys(['street', 'zip', 'city']);
		expect(this.test.user._doc).to.deep.include({
			email: 'pepito@mail.com',
			name: 'Pepito Perez',
			role: 'customer',
		});
		expect(this.test.user._doc.adress).to.deep.include({
			street: 'Corazongatan 3',
			zip: '123 56',
			city: 'SuperCity',
		});
		expect(this.test.user.password).to.not.equal('12345');
	});

	it('Should login a user and sign a JWT token', async function () {
		const login = await userModel.login('pepito@mail.com', '12345');
		expect(login).to.be.a('object');
	});

	it('Should return message: Email not found', async function () {
		const wrongEmail = await userModel.login('pepio@mail.com', '12345');
		expect(wrongEmail).to.be.a('object');
		expect(wrongEmail).to.deep.include({
			message: 'Email not found',
		});
	});

	it('Should return message: Password not correct', async function () {
		const wrongPw = await userModel.login('pepito@mail.com', '52345');
		expect(wrongPw).to.be.a('object');
		expect(wrongPw).to.deep.include({
			message: 'Password not correct',
		});
	});

	it('Should return verify token and return signature', async function () {
		const login = await userModel.login('pepito@mail.com', '12345');
		const user = await userModel.verifyToken(login.token, process.env.SECRET);
		expect(user).to.be.a('object');
		expect(user).to.deep.include({
			email: 'pepito@mail.com',
			name: 'Pepito Perez',
			role: 'customer',
			adress: {
				street: 'Corazongatan 3',
				zip: '123 56',
				city: 'SuperCity',
			},
		});
	});
});
