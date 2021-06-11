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
        size,
    };
};

productsHelper.getCertainProducts = ({ refinements }) => {
    let products = ProductMgr.getAllProductes();

    if (refinements) {
        const { name, priceFrom, priceTo, color, size } = refinements;

        if (name) products = products.filter((p) => p.name.includes(name));
        if (priceFrom) products = products.filter((p) => p.price >= priceFrom);
        if (priceTo) products = products.filter((p) => p.price <= priceTo);
        if (color && color.length) products = products.filter((p) => color.includes(p.custom.color));
        if (size && size.length) products = products.filter((p) => size.includes(p.custom.size));
    }

    // return ProductFactory.createCertainMasterProduct(products) w
    // TODO finish func
};

module.exports = productsHelper;
