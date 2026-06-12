require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');

app.use(cors());
app.use(express.json());

const userRoutes     = require('./Routes/userRoutes');
const productRoutes  = require('./Routes/productRoutes');
const orderRoutes    = require('./Routes/orderRoutes');
const cartRoutes     = require('./Routes/cartRoutes');
const wishlistRoutes = require('./Routes/wishlistRoutes');

app.use('/users',    userRoutes);
app.use('/products', productRoutes);
app.use('/orders',   orderRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/cart',     cartRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});