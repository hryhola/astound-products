const decorators = require('~/models/product/decorators');

module.exports = function productTile(product, apiProduct, options) {
    decorators.base(product, apiProduct);
    return product;
}
