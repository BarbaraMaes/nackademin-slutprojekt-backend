const mongoose = require('mongoose');
const productModel = require('../models/productModel');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

let mongoDatabase;

switch (process.env.ENVIRONMENT) {
	case 'develop':
		mongoDatabase = {
			getUri: async () =>
				`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
		};
		break;
	case 'test':
		mongoDatabase = new MongoMemoryServer({ binary: { version: '4.4.1' } });
		break;
	case 'production':
	case 'staging':
		mongoDatabase = {
			getUri: async () =>
				`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
		};
		break;
}

async function connect() {
	let uri = await mongoDatabase.getUri();

	await mongoose.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	});

	//await productModel.init();
}

async function disconnect() {
	await mongoose.disconnect();
	if (process.env.ENVIRONMENT == 'test' || process.env.ENVIRONMENT == 'develop') {
		await mongoDatabase.stop();
	}
}

module.exports = {
	connect,
	disconnect,
};
