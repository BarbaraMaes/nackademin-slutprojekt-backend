const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { expect, request } = require('chai');

const Database = require('../../database/database');
const productModel = require('../../models/productModel');
const userModel = require('../../models/userModel');
const app = require('../../app');

describe('Integration test for products', async function () {
	before(async function () {
		try {
			await Database.connect();
		} catch (error) {
			console.log(error);
		}
	});
	beforeEach(async function () {
		await productModel.clear();
		await userModel.clear();
		this.currentTest.prodObj = {
			title: 'Producto',
			price: 300,
			shortDesc: 'This is a new prod',
			longDesc: 'Long description!',
			imgFile: 'skateboard-greta.png',
		};
		const person = {
			email: 'pepito@mail.com',
			password: '12345',
			name: 'Pepito Perez',
			role: 'admin',
			adress: {
				street: 'Corazongatan 3',
				zip: '123 56',
				city: 'SuperCity',
			},
		};
		await userModel.signup(person);
		this.currentTest.token = await userModel.login(person.email, person.password);
	});
	after(async () => {
		try {
			await Database.disconnect();
		} catch (error) {
			console.log(error);
		}
	});

	it('POST /api/products', async function () {
		const resp = await request(app)
			.post('/api/products')
			.set('Content-Type', 'application/json')
			.set('Authorization', 'Bearer ' + this.test.token.token)
			.send(this.test.prodObj);
		expect(resp.body).to.be.a('object');
		expect(resp).to.have.status(201);
		expect(resp.body.product).to.include({
			title: 'Producto',
			price: 300,
			shortDesc: 'This is a new prod',
			longDesc: 'Long description!',
			imgFile: 'skateboard-greta.png',
		});
	});
	it('PATCH /api/products/:id', async function () {
		const product = await productModel.createProduct(this.test.prodObj);
		const updateValues = {
			title: 'updated product',
		};
		const resp = await request(app)
			.patch(`/api/products/${product._id}`)
			.set('Content-Type', 'application/json')
			.set('Authorization', 'Bearer ' + this.test.token.token)
			.send(updateValues);
		expect(resp.body).to.be.a('object');
		expect(resp).to.have.status(200);
		expect(resp.body).to.include({
			title: updateValues.title,
			price: product.price,
			shortDesc: product.shortDesc,
			longDesc: product.longDesc,
			imgFile: product.imgFile,
		});
	});

	it('DELETE /api/products/:id', async function () {
		const product = await productModel.createProduct(this.test.prodObj);
		const resp = await request(app)
			.delete(`/api/products/${product._id}`)
			.set('Content-Type', 'application/json')
			.set('Authorization', 'Bearer ' + this.test.token.token);
		expect(resp.body.deletedCount).to.equal(1);
		expect(resp).to.have.status(200);
	});

	it('GET /api/products/:id', async function () {
		const product = await productModel.createProduct(this.test.prodObj);
		const resp = await request(app)
			.get(`/api/products/${product._id}`)
			.set('Content-Type', 'application/json');
		expect(resp).to.have.status(200);
		expect(resp.body).to.include({
			title: product.title,
			price: product.price,
			shortDesc: product.shortDesc,
			longDesc: product.longDesc,
			imgFile: product.imgFile,
			_id: product._id.toString(),
		});
	});
	it('GET /api/products/', async function () {
		for (let i = 0; i < 3; i++) {
			const prod = {
				title: `Producto ${i}`,
				price: 300,
				shortDesc: 'This is a new prod',
				longDesc: 'Long description!',
				imgFile: 'skateboard-greta.png',
			};
			await productModel.createProduct(prod);
		}
		const resp = await request(app).get(`/api/products/`).set('Content-Type', 'application/json');
		expect(resp).to.have.status(200);
		expect(resp.body).to.be.a('array');
		expect(resp.body.length).to.equal(3);
	});

	it('GET request with unkown id GET /api/products/:id', async function () {
		const id = new mongoose.Types.ObjectId(123);
		const resp = await request(app)
			.get(`/api/products/${id}`)
			.set('Content-Type', 'application/json');
		expect(resp).to.have.status(404);
	});

	it('POST /api/products/ without being logged in', async function () {
		const resp = await request(app)
			.post('/api/products')
			.set('Content-Type', 'application/json')
			.send(this.test.prodObj);
		expect(resp).to.have.status(403);
	});
});
