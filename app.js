const express = require('express')
const app = express();

//Route Imports
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

app.use(express.json())
app.use(express.static('public'));

app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api", userRoutes);

module.exports = app;