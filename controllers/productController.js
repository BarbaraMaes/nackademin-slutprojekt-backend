//import Model
const productModel = require('../models/productModel');

//skapar produkten.
exports.createProduct = async (req, res) => {
	try {
		const prod = {
			title: req.body.title,
			price: req.body.price,
			shortDesc: req.body.shortDesc,
			longDesc: req.body.longDesc,
			imgFile: req.body.imgFile,
		};
		const product = await productModel.createProduct(prod);
		res.status(201).send({ product });
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
};

//hämtar ID från req.params och updaterar denna produkt.
exports.updateProduct = async (req, res) => {
	try {
		const productId = req.params.productId;
		const product = await productModel.updateProduct(productId, req.body);
		res.status(200).json(product);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
};

//hämtar ID från req.params och tar bort denna produkt.
exports.deleteProduct = async (req, res) => {
	try {
		const productId = req.params.productId;
		const deleted = await productModel.deleteProduct(productId);
		res.status(200).json(deleted);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
};

//hämtar alla produkter
exports.getAllProducts = async (req, res) => {
	try {
		const products = await productModel.getAllProducts();
		res.status(200).json(products);
	} catch (error) {
		res.status(404).send({ message: error.message });
	}
};

//hämtar ID från req.params och hämtar denna produkt.
exports.getProduct = async (req, res) => {
	try {
		const productId = req.params.productId;
		const product = await productModel.getProduct(productId);
		res.status(200).json(product);
	} catch (error) {
		if (error.message === 'not found') {
			res.status(404).send({ message: error.message });
		}
	}
};
