require('dotenv').config();
const User = require('../models/userModel');

exports.isAdmin = async (req, res, next) => {
	const user = req.user;
	if (user.role === "admin") {
		next();
	}
	if (user.role === "customer") {
		return res.status(403).json({ message: "access denied" });
	}
}

exports.authenticate = async (req, res, next) => {
	if (!req.headers.authorization) return res.sendStatus(403);
	try {
		const token = req.headers.authorization.replace('Bearer ', '');
		const payload = await User.verifyToken(token, process.env.SECRET);
		req.user = payload;
		next();
	} catch (error) {
		return res.status(403).json(error);
	}
};

exports.anonymous = async (req, res, next) => {
	try {
		const token = req.headers.authorization.replace('Bearer ', '');
		const payload = await User.verifyToken(token, process.env.SECRET);
		req.user = payload;
		next();
	} catch (error) {
		next();
	}
};
