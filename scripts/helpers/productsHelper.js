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
    const allProducts = ProductMgr.getAllProductes();
    let products = [...allProducts];

    if (refinements) {
        const { name, priceFrom, priceTo, color, size } = refinements;

        if (name) products = products.filter((p) => p.name.toLowerCase().includes(name.toLowerCase()));
        if (priceFrom) products = products.filter((p) => p.price >= priceFrom);
        if (priceTo) products = products.filter((p) => p.price <= priceTo);
        if (color && color.length) products = products.filter((p) => color.includes(p.custom.color));
        if (size && size.length) products = products.filter((p) => size.includes(p.custom.size));
    }

    const variationProducts = products.filter((p) => !p.isMaster);

    const masterProducts = products
        .filter((p) => p.isMaster)
        .map((p) => ({
            ...p,
            variations: p.variations.filter((v) => variationProducts.some((s) => s.id === v.pid)),
        }));

    for (const variant of variationProducts) {
        if (!masterProducts.some((s) => s.id === variant.master)) {
            const master = allProducts.find((p) => p.id === variant.master);
            masterProducts.push({
                ...master,
                variations: master.variations.filter((v) => variationProducts.some((s) => s.id === v.pid)),
            });
        }
    }

    const createdMasterProducts = masterProducts.map((m) => ProductFactory.createMasterProduct(m, variationProducts));

    const productsWithVariations = createdMasterProducts.filter((m) => m.variations.length > 0);

    return productsWithVariations;
};

module.exports = productsHelper;
