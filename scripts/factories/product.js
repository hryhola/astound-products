const ProductMgr = require("~/scripts/managers/ProductMgr");
const productTile = require("~/models/product/productTile");
const fullProduct = require("~/models/product/fullProduct");
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
    createMasterProduct: function (apiMasterProduct) {
        const withVariations = {
            ...apiMasterProduct,
            variations: apiMasterProduct.variations.map((v) => {
                const details = ProductMgr.getProduct(v.pid);
                return {
                    ...v,
                    name: details.name,
                    shortDescription: details.shortDescription || apiMasterProduct.shortDescription,
                    longDescription: details.longDescription || apiMasterProduct.longDescription,
                    color: details.custom.color || apiMasterProduct.custom.color,
                    price: details.price || apiMasterProduct.price,
                };
            }),
        };
        return masterProduct({}, withVariations);
    },
};
