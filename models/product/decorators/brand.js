module.exports = function (product, apiProduct) {
    Object.defineProperty(product, 'brand', {
        enumerable: true,
        value: apiProduct.brand
    });
}