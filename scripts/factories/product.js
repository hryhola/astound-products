const ProductMgr = require("~/scripts/managers/ProductMgr");
const productTile = require("~/models/product/productTile");
const fullProduct = require("~/models/product/fullProduct");
const variation = require("~/models/product/variation");
const masterProduct = require("~/models/product/masterProduct");

module.exports = {
    createProduct: function (apiProduct, view) {
        switch (view) {
            case "tile":
                return productTile({}, apiProduct, {});
            default:
                return fullProduct({}, apiProduct, {});
        }
    },
    createMasterProduct: function (apiMasterProduct, apiVariations) {
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
