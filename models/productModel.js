const mongoose = require('mongoose');
const products = require('../database/products.json');

//productschema enligt anvisningarna.
const productSchema = new mongoose.Schema({
	title: String,
	price: Number,
	shortDesc: String,
	longDesc: String,
	imgFile: String,
});

const Product = mongoose.model('Product', productSchema);

//laddar in alle produkter från product.json i databasen. kommenteras ut i database.js vid användning av ny databas
exports.init = async () => {
	const productsOnDB = await Product.find({});
	if (productsOnDB.length === 0) {
		console.log('Created all products on DB')
		products.forEach(async (product) => {
			await Product.create(product);
		});
	}
};

//tar emot ett product object och sparar den i databasen.
exports.createProduct = async (prod) => {
	const product = await Product.create(prod);
	if (!product) {
		throw new Error('could not create product');
	}
	return product._doc;
};

//tar emot id på produkten som ska uppdateras samt nya objektet, produkten uppdateras i databasen.
exports.updateProduct = async (id, prod) => {
	const updated = await Product.findByIdAndUpdate(id, prod, { new: true });
	if (!updated) {
		throw new Error('something went wrong');
	}
	return updated._doc;
};

//tar bort produkten med ID
exports.deleteProduct = async (id) => {
	const deleted = await Product.deleteOne({ _id: id });
	if (!deleted) {
		throw new Error('something went wrong');
	}
	return deleted;
};

//hämtar alla produkter från databasen
exports.getAllProducts = async () => {
	const products = await Product.find({});
	if (!products) {
		throw new Error('no products found');
	}
	return products;
};

//hämtar en specific produkt från databasen enligt ID
exports.getProduct = async (id) => {
	const product = await Product.findById(id);
	if (!product) {
		throw new Error('not found');
	}
	return product._doc;
};

//tömmer databasen, används för testerna.
exports.clear = async () => {
	await Product.deleteMany({});
};
