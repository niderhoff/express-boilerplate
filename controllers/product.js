const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({});
    res.status(200).json({ products, nbHits: products.length });
    // or throw new Error("some error")
};

const getAllProducts = async (req, res) => {
    const { name, flag, sort, fields, numericFilters } = req.query;
    const queryObject = {};
    if (flag) queryObject.flag = flag === true;
    if (name) queryObject.name = { $regex: name, $options: 'i' };
    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        const filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        );
        const options = ['price', 'rating'];
        filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-');
            if (options.includes(field)) {
                queryObject[field] = { [operator]: Number(value) };
                // result:
                // { price: { '$gt' : 40}, rating: {'$gte', 4 } }
            }
        });
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
