module.exports = function (product, apiProduct, options) {
    Object.defineProperty(product, 'price', {
        enumerable: true,
        value: apiProduct.price
    });
}