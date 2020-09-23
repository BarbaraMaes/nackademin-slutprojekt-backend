//import Model
const orderModel = require('../models/orderModel');
const userModel = require('../models/userModel');

//Kollar om en användare har loggat in, om så är fallet skapas en order
//som läggs till i orderHistory i användarens objekt
exports.createOrder = async (req, res) => {
	if (req.user) {
		try {
			const order = await orderModel.createOrder(req.body);
			await userModel.updateOrderHistory(req.user.userId, order);
			return res.status(200).json(order);
		} catch (error) {
			return res.status(404).send(error);
		}
		//Om det inte finns en inloggad användare så skapas bara en order
	} else {
		try {
			const order = await orderModel.createOrder(req.body);
			return res.status(200).json(order);
		} catch (error) {
			return res.status(404).send(error);
		}
	}
};

//Hanterar request från klienten, hämtar ordrar för admin och inloggade användare.
exports.getOrders = async (req, res) => {
	try {
		if (req.user.role === 'admin') {
			const orders = await orderModel.getAllOrders();
			return res.status(200).json(orders);
		} else {
			const orderIds = await userModel.getOrderHistory(req.user.userId);
			const orders = await orderModel.getOrders(orderIds);
			return res.status(200).json(orders);
		}
		//Returnerar en lista på samtliga ordrar för admins, och ägda orders för inloggad användare.
	} catch (error) {
		return res.status(404).send(error);
	}
};
