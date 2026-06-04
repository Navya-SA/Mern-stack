const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/e-commerce')
const db = mongoose.connection;

db.on('open', () => {
    console.log('DB connected');
});

db.on('error', (err) => {
    console.log(err);
});
module.exports= db;