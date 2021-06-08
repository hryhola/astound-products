const ProductMgr = require('~/scripts/managers/ProductMgr');

const productTile = require('~/models/product/productTile');
const fullProduct = require('~/models/product/fullProduct');

module.exports = {
    get: function (params) {
        const productId = params.pid;
        const apiProduct = ProductMgr.getProduct(productId);
        let product = {};

        switch (params.pview) {
            case 'tile': 
                product = productTile(product, apiProduct, {});
                break;
            default:
                product = fullProduct(product, apiProduct, {});
                break;
        }
        return product;
    }
}
