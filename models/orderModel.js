const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
	timestamp: Date,
	status: String,
	items: Array,
	orderValue: Number,
});

const Order = mongoose.model('Order', orderSchema);

//Skapar en order
exports.createOrder = async (order) => {
	const doc = await Order.create({
		timestamp: new Date(),
		status: 'inProcess',
		items: order.items,
		orderValue: order.orderValue,
	});
	return doc;
};

//Rensar alla ordrar i databasen
exports.clear = async () => {
	const doc = await Order.deleteMany({});
	return doc;
};

//Hämtar en order med order-id
exports.getOrders = async (orderIds) => {
	let orders = [];
	for await (id of orderIds) {
		let order = await Order.findById(id);
		orders.push(order);
	}
	return orders;
};

//Hämtar alla ordrar
exports.getAllOrders = async () => {
	let orders = await Order.find({});
	return orders;
};
