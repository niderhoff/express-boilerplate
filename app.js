require('dotenv').config();
require('express-async-errors');

// security
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

const express = require('express');
const morgan = require('morgan');

const app = express();
const port = process.env.NODE_PORT;

const connectDB = require('./db/connect');
const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');

// middleware functions
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authMiddleware = require('./middleware/auth');

// middleware
app.set('trust proxy', 1); // we need this if app is behind a proxy
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
    })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// serve static content
// app.use(express.static("/static"))

// logging
app.use(morgan('dev'));

// routes
app.get('/', (req, res) => res.send('<a href="/api/v1/product">Go Here</a>'));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/product', authMiddleware, productsRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// main
const start = async () => {
    if (!('JWT_SECRET' in process.env))
        throw new Error('Please set JWT_SECRET in .env');
    if (!('MONGO_URI' in process.env))
        throw new Error('Please set MONGO_URI in .env');
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log('running...'));
    } catch (error) {
        console.log(error);
    }
};
start();
