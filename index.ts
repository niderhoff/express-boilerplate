require('dotenv').config();
require('express-async-errors');

import express from 'express';
import morgan from 'morgan';

const app = express();
const port = process.env.NODE_PORT;

import connectDB from './db/connect';
import loginRouter from './routes/login';
import productsRouter from './routes/products';

// middleware functions
import notFoundMiddleware from './middleware/not-found';
import errorHandlerMiddleware from './middleware/error-handler';
import { assert } from 'console';

// middleware
app.use(express.json());

// serve static content
// app.use(express.static("/static"))

// logging
app.use(morgan('dev'));

// routes
app.get('/', (req, res) => res.send('<a href="/api/v1/product">Go Here</a>'));
app.use('/login', loginRouter);
app.use('/api/v1/product', productsRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// main
const start = async () => {
    assert(typeof process.env.JWT_SECRET === "string", 'Please set JWT_SECRET in .env')
    if (!(typeof process.env.MONGO_URI === "string")) throw new Error("Please set MONGO_URI in .env")
    else try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => console.log('running...'));
    } catch (error) {
        console.log(error);
    }
};
start();
