const ProductFactory = require("~/scripts/factories/product");
const ProductMgr = require("~/scripts/managers/ProductMgr");
const productsHelper = {};

productsHelper.getProductTile = (pid) => {
    const apiProduct = ProductMgr.getProduct(pid);

    return ProductFactory.createProduct(apiProduct, pview);
};

productsHelper.getAllGroupedByMaster = () => {
    const onlyMasterProductes = ProductMgr.getAllMasterProductes();

    return onlyMasterProductes.map((m) => ProductFactory.createMasterProduct(m));
};

module.exports = productsHelper;
