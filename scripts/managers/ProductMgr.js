const _ = require("lodash");
const products = require("~/db/products.json");

const ProductMgr = {};

ProductMgr.getProduct = (productId) => {
    return products.find((product) => product.id === productId);
};

ProductMgr.getAllProductes = () => products;

ProductMgr.getAllMasterProductes = () => products.filter((p) => p.isMaster);

ProductMgr.getMinMaxPrice = () => {
    const prices = products.map((p) => p.price);

    return [Math.min(...prices), Math.max(...prices)];
};

ProductMgr.getAllColors = () => {
    const colors = _.flatten(
        products
            .filter((p) => p.isMaster && p.variationAttribute === "color")
            .map((p) => p.variations)
        ).map((v) => v.id);

    return [...new Set(colors)];
};

ProductMgr.getAllSizes = () => {
    const sizes = _.flatten(
        products
            .filter((p) => p.isMaster && p.variationAttribute === "size")
            .map((p) => p.variations)
        ).map((v) => v.id);

    return [...new Set(sizes)];
};

module.exports = ProductMgr;
