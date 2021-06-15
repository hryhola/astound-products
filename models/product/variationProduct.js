const decorators = require('~/models/product/decorators');

module.exports = function variation(outObj, apiProduct, apiMasterProduct, variationProps) {
    decorators.base(outObj, apiProduct, { noId: true });
    decorators.price(outObj, apiProduct);
    decorators.variationAttributes(outObj, apiProduct, apiMasterProduct, variationProps);
    decorators.description(outObj, apiProduct);

    return outObj;
}
