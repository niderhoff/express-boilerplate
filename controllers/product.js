const { StatusCodes } = require('http-status-codes');
const Product = require('../models/Product');
const { BadRequestError, NotFoundError } = require('../errors');

const parseNumericFilter = (
    numericFilters,
    queryObj,
    allowed = ['rating', 'price']
) => {
    const operatorMap = {
        '>': '$gt',
        '>=': '$gte',
        '=': '$eq',
        '<': '$lt',
        '<=': '$lte',
    };
    const regEx = /(.+)(<|>|>=|=|<|<=)(.+)/g;
    return numericFilters.split(',').reduce((obj, str) => {
        const [[, variable, predicate, value]] = [...str.matchAll(regEx)];
        const operator = operatorMap[predicate];
        if (allowed.includes(variable)) {
            return { ...obj, [variable]: { [operator]: value } };
        }
        return obj;
    }, queryObj);
};

const getAllProducts = async (req, res) => {
    const { name, flag, sort, fields, numericFilters } = req.query;
    let queryObject = { createdBy: req.user.userId };
    if (flag) queryObject.flag = flag === true;
    if (name) queryObject.name = { $regex: name, $options: 'i' };
    if (numericFilters) {
        queryObject = parseNumericFilter(numericFilters, queryObject);
    }

    let result = Product.find(queryObject);

    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else result = result.sort('createdAt');

    if (fields) {
        const fieldList = sort.split(',').join(' ');
        result = result.select(fieldList);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const products = await result;
    res.status(200).json({ products, nbHits: products.length });
};

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({ createdBy: req.user.userId });
    res.status(StatusCodes.OK).json({ products, count: products.length });
    // or throw new Error("some error")
};

const getProduct = async (req, res) => {
    const {
        user: { userId },
        params: { id: productId },
    } = req;
    const job = await Product.findOne({
        _id: productId,
        createdBy: userId,
    });
    if (!job) {
        throw new NotFoundError(`product ${productId} does not exist.`);
    }
    res.status(StatusCodes.OK).json({ job });
};

const createProduct = async (req, res) => {
    req.body.createdBy = req.user.userId;
    try {
        const product = await Product.create(req.body);
        res.status(StatusCodes.CREATED).json(product);
    } catch (error) {
        // TODO: handle mongoose Validation Errors
        throw new Error(error);
    }
};

const updateProduct = async (req, res) => {
    const {
        body: { name, flag, price, rating, variant },
        user: { userId },
        params: { id: productId },
    } = req;
    if (
        name === '' ||
        flag === '' ||
        price === '' ||
        rating === '' ||
        variant === ''
    )
        throw new BadRequestError('fields cannot be empty strings.');
    const product = await Product.findByIdAndUpdate(
        {
            _id: productId,
            createdBy: userId,
        },
        // options
        {
            new: true, // return the updated object instead of the old one
            runValidators: true, // run the field validation
        }
    );
    if (!product)
        throw new NotFoundError(`product ${productId} does not exist.`);
    res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
    const {
        user: { userId },
        params: { id: productId },
    } = req;
    const product = await Product.findOneAndRemove({
        _id: productId,
        createdBy: userId,
    });
    if (!product)
        throw new NotFoundError(`product ${productId} does not exist.`);
    res.status(StatusCodes.OK).json({ product });
};

module.exports = {
    getAllProducts,
    getAllProductsStatic,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
};
