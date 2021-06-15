module.exports = function (product, apiProduct) {
    Object.defineProperty(product, 'shortDescription', {
        enumerable: true,
        value: apiProduct.shortDescription
    });
    Object.defineProperty(product, 'longDescription', {
        enumerable: true,
        value: apiProduct.longDescription
    });
}