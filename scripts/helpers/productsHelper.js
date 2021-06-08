const ProductFactory = require('~/scripts/factories/product');
const productsHelper = {};

productsHelper.getProductTile = function (productId) {
    return ProductFactory.get({
        pid: productId,
        pview: 'tile'
    })
};

module.exports = productsHelper;
