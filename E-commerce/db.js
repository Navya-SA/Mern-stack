const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

db.on('open', () => {
    console.log('DB connected');
});

db.on('error', (err) => {
    console.log(err);
});

module.exports = db;