const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({});
    res.status(200).json({ products, nbHits: products.length });
    // or throw new Error("some error")
};

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
    let queryObject = {};
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

module.exports = { getAllProducts, getAllProductsStatic };
