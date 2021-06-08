const products = require('~/db/products.json');

const ProductMgr = {};

ProductMgr.getProduct = function (productId) {
    return products.find(function (product) {
        return product.id === productId;
    });
};

module.exports = ProductMgr;
