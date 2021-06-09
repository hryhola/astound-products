const decorators = require('~/models/product/decorators');

module.exports = function masterProduct(product, apiProduct) {
    decorators.base(product, apiProduct);
    decorators.brand(product, apiProduct);
    decorators.variations(product, apiProduct);
    return product;
}
