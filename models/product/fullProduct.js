const decorators = require('~/models/product/decorators');

module.exports = function fullProduct(product, apiProduct, options) {
    decorators.base(product, apiProduct);
    decorators.price(product, apiProduct, options);
    return product;
}
