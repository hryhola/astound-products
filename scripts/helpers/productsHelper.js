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

productsHelper.getRefinements = () => {
    const price = ProductMgr.getMinMaxPrice();
    const color = ProductMgr.getAllColors();
    const size = ProductMgr.getAllSizes();

    return {
        price,
        color,
        size
    }
}

module.exports = productsHelper;
