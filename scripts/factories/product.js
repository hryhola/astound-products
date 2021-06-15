const ProductMgr = require("~/scripts/managers/ProductMgr");
const variation = require("~/models/product/variation");
const variationProduct = require("~/models/product/variationProduct");
const masterProduct = require("~/models/product/masterProduct");

module.exports = {
    createVariation: function(apiVariationProduct, apiMasterProduct) {
        apiMasterProduct = apiMasterProduct || ProductMgr.getProduct(apiVariationProduct.master);
        const variationProps = apiMasterProduct.variations.find(v => v.pid === apiVariationProduct.id);

        return variationProduct({}, apiVariationProduct, apiMasterProduct, variationProps);
    },
    createMasterProduct: function (apiMasterProduct, { apiVariations } = {}) {
        const withVariations = {
            ...apiMasterProduct,
            variations: apiMasterProduct.variations.map((v) => {
                const details = apiVariations ? apiVariations.find((p) => p.id === v.pid) : ProductMgr.getProduct(v.pid);
                return variation(v, details, apiMasterProduct, v);
            }),
        };
        return masterProduct({}, withVariations);
    },
};
