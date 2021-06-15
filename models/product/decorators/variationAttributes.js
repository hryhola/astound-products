module.exports = function (variationObject, apiProduct, apiMasterProduct, variationProps) {
    Object.defineProperty(variationObject, "pid", {
        enumerable: true,
        value: variationProps.pid,
    });
    Object.defineProperty(variationObject, "color", {
        enumerable: true,
        value: apiProduct.custom.color || apiMasterProduct.custom.color,
    });
    Object.defineProperty(variationObject, "size", {
        enumerable: true,
        value: apiProduct.custom.size || apiMasterProduct.custom.size,
    });
    Object.defineProperty(variationObject, "displayValue", {
        enumerable: true,
        value: variationProps.displayValue.replace(/_/g, " "),
    });
};
