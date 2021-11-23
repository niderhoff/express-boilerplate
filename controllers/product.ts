import { Request, Response } from 'express';
import { ParsedQs } from 'qs';
import Product from '../models/product';

const getAllProductsStatic = async (req: Request, res: Response) => {
    const products = await Product.find({});
    res.status(200).json({ products, nbHits: products.length });
    // or throw new Error("some error")
};

const parseNumericFilter = (
    numericFilters: string,
    queryObj: QueryObj,
    allowed = ['rating', 'price']
) => {
    interface IDictionary {
        [index: string]: string
    }
    const operatorMap: IDictionary = {
        '>': '$gt',
        '>=': '$gte',
        '=': '$eq',
        '<': '$lt',
        '<=': '$lte',
    };
    const regEx = /(.+)(<|>|>=|=|<|<=)(.+)/g;
    return numericFilters.split(',').reduce((obj, str) => {
        // destructure capture groups from Regex result
        const [[, colName, predicate, value]] = [...str.matchAll(regEx)];
        // map predicate to mongodb operator
        const operator = operatorMap[predicate];
        // check if we are allowed to use numericFilter on this column and then
        // add filter to queryObj otherwise return unmodified queryObj
        if (allowed.includes(colName)) {
            return { ...obj, [colName]: { [operator]: value } };
        }
        return obj;
    }, queryObj);
};

type allowedCols = 'rating' | 'price'
type allowedPred = '>' | '>=' | '=' | '<' | '<='
type Filter = {
    [predicate in allowedPred]: string
}
type QueryFilters = {
    [colName in allowedCols]?: Filter;
}
interface QuerySelect {
    name?: { $regex: string; $options: string; };
    flag?: boolean;
    sort?: boolean;
}
type QueryObj = QuerySelect & QueryFilters


const getAllProducts = async (req: Request<{}, {}, {}, ParsedQs>, res: Response) => {
    const { name, flag, sort, fields, numericFilters } = req.query;
    // queryObj will carry all the different filters and selectors for us. We
    // will pass it to mongodb.
    let queryObject: QueryObj = {};
    if (typeof flag == "string") queryObject.flag = flag === "true";
    if (typeof name == "string") queryObject.name = { $regex: name, $options: 'i' };
    if (typeof numericFilters == "string") {
        queryObject = parseNumericFilter(numericFilters, queryObject);
    }

    let result = Product.find(queryObject);

    if (typeof sort == "string") {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else result = result.sort('createdAt');

    if (typeof fields == "string") {
        const fieldList = fields.split(',').join(' ');
        result = result.select(fieldList);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const products = await result;
    res.status(200).json({ products, nbHits: products.length });
};

export { getAllProducts, getAllProductsStatic };
