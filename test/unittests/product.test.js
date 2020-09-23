const chai = require('chai');
const { expect, request } = require('chai');

const Database = require('../../database/database');
const productModel = require('../../models/productModel');
const userModel = require('../../models/userModel');

describe('Product Unit tests', () => {
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
		const prodObj = {
			title: 'Producto',
			price: 300,
			shortDesc: 'This is a new prod',
			longDesc: 'Long description!',
			imgFile: 'skateboard-greta.png',
		};
		this.currentTest.product = await productModel.createProduct(prodObj);
	});
	after(async () => {
		try {
			await Database.disconnect();
		} catch (error) {
			console.log(error);
		}
	});

	it('should create a product', async function () {
		try {
			expect(this.test.product).to.be.a('object');
			expect(this.test.product).to.include.all.keys(
				'title',
				'price',
				'shortDesc',
				'longDesc',
				'imgFile'
			);
			expect(this.test.product).to.include({
				title: 'Producto',
				price: 300,
				shortDesc: 'This is a new prod',
				longDesc: 'Long description!',
				imgFile: 'skateboard-greta.png',
			});
		} catch (error) {
			console.log(error);
		}
	});

	it('Should update a product', async function () {
		try {
			const newProduct = { title: 'Product updated!' };
			const productUpdated = await productModel.updateProduct(this.test.product._id, newProduct);

			expect(productUpdated).to.be.a('object');
			expect(productUpdated).to.include.all.keys(
				'title',
				'price',
				'shortDesc',
				'longDesc',
				'imgFile'
			);
			expect(productUpdated).to.include({
				title: 'Product updated!',
				price: 300,
				shortDesc: 'This is a new prod',
				longDesc: 'Long description!',
				imgFile: 'skateboard-greta.png',
			});
		} catch (error) {
			console.log(error);
		}
	});

	it('Should delete a product', async function () {
		try {
			const deletedProduct = await productModel.deleteProduct(this.test.product._id);
			expect(deletedProduct.deletedCount).to.equal(1);
		} catch (error) {
			console.log(error);
		}
	});

	it('Should get a product', async function () {
		try {
			const product = await productModel.getProduct(this.test.product._id);

			expect(product).to.be.a('object');
			expect(product).to.eql(this.test.product);
		} catch (error) {
			console.log(error);
		}
	});

	it('Should get all products', async function () {
		try {
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

			const products = await productModel.getAllProducts();

			expect(products).to.be.a('array');
			expect(products.length).to.equal(4);
		} catch (error) {
			console.log(error);
		}
	});
});
