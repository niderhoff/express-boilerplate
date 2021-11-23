require('dotenv').config();
const connectDB = require('./db/connect');
const Product = require('./models/Product');
const User = require('./models/User');
const jsonProducts = require('./products.json');
// products.json is an array of objects to be inserted ([{}, {}, ..])

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        await User.deleteMany();
        await Product.deleteMany();
        await Product.create(jsonProducts);
        console.log('success');
        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};
start();
