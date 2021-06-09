module.exports = function (product, apiProduct) {
    Object.defineProperty(product, "variationAttribute", {
        enumerable: true,
        value: apiProduct.variationAttribute,
    });
    Object.defineProperty(product, "variations", {
        enumerable: true,
        value: apiProduct.variations,
    });
};