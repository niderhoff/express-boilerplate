require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const port = process.env.NODE_PORT;

const connectDB = require('./db/connect');
const loginRouter = require('./routes/login');
const productsRouter = require('./routes/products');

// middleware functions
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// middleware
app.use(express.json());

// serve static content
// app.use(express.static("/static"))

// logging
const morgan = require('morgan');
app.use(morgan('dev'));

// routes
app.get('/', (req, res) => res.send('<a href="/api/v1/product">Go Here</a>'));
app.use('/login', loginRouter);
app.use('/api/v1/product', productsRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// main
const start = async () => {
    if (!('JWT_SECRET' in process.env))
        throw new Error('Please set JWT_SECRET in .env');
    try {
        if ('MONGO_URI' in process.env) {
            await connectDB(process.env.MONGO_URI);
        } else {
            throw new Error('Please set MONGO_URI in .env');
        }
        app.listen(port, console.log('running...'));
    } catch (error) {
        console.log(error);
    }
};
start();
