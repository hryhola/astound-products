const decorators = require('~/models/product/decorators');

module.exports = function variation(varianionObject, apiProduct, apiMasterProduct, variationProps) {
    decorators.base(varianionObject, apiProduct);
    decorators.price(varianionObject, apiProduct);
    decorators.variationAttributes(varianionObject, apiProduct, apiMasterProduct, variationProps);

    return varianionObject;
}
