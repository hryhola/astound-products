module.exports = function (product, apiProduct, options = {}) {
    !options.noId && Object.defineProperty(product, 'ID', {
        enumerable: true,
        value: apiProduct.id
    });
    Object.defineProperty(product, 'name', {
        enumerable: true,
        value: apiProduct.name
    });
    Object.defineProperty(product, 'image', {
        enumerable: true,
        value: apiProduct.image 
    });
}
