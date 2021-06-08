module.exports = function (product, apiProduct) {
    Object.defineProperty(product, 'ID', {
        enumerable: true,
        value: apiProduct.id
    });
    Object.defineProperty(product, 'name', {
        enumerable: true,
        value: apiProduct.name
    });
}
