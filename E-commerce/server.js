require('dotenv').config();
const express= require('express');
const app = express();
const db=require('./db');
const User = require('./model/userSchema');
const Product = require('./model/productSchema');
const orderRoutes = require("./Routes/orderRoutes");

const cors = require('cors');

app.use(cors());
app.use(express.json());

const PORT = 3000;
app.use(express.json());
app.use("/orders", orderRoutes);
const userRoutes = require('./Routes/userRoutes');
app.use('/users', userRoutes);
const productRoutes = require('./Routes/productRoutes')
app.use('/products', productRoutes)


app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);   
});

app.use("/orders", orderRoutes);