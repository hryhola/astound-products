const ProductFactory = require("~/scripts/factories/product");
const ProductMgr = require("~/scripts/managers/ProductMgr");
const pageHelper = require("./pageHelper");
const productsHelper = {};

productsHelper.publicErrors = {
    invalidMasterIdMessae: "Invalid master id",
    invalidVariationIdMessae: "Invalid variation id",
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

productsHelper.applyRefinements = (productsData, refinements) => {
    const { name, priceFrom, priceTo, color, size } = refinements;
    let products = [...productsData];

    if (name) products = products.filter((p) => p.name.toLowerCase().includes(name.toLowerCase()));
    if (priceFrom) products = products.filter((p) => p.price >= priceFrom);
    if (priceTo) products = products.filter((p) => p.price <= priceTo);

    if ((color && color.length) || (size && size.length))
        products = products.filter((p) => {
            let isValid = false;

            if (color && color.length) {
                isValid = isValid || color.includes(p.custom.color);
            }

            if (size && size.length) {
                isValid = isValid || size.includes(p.custom.size);
            }

            return isValid;
        });

    return products;
};

// productsHelper.sortBy = (productsData, sortBy) => {
//     switch (sortBy) {
//         case "price": return [].sort(p => )
//     }
// }

productsHelper.getCertainProducts = ({ refinements }) => {
    const allProducts = ProductMgr.getAllProductes();
    let products = [...allProducts];

    if (refinements) {
        products = productsHelper.applyRefinements(products, refinements);
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

    const createdMasterProducts = masterProducts.map((m) => ProductFactory.createMasterProduct(m, { apiVariations: variationProducts }));

    const productsWithVariations = createdMasterProducts.filter((m) => m.variations.length > 0);

    return productsWithVariations;
};

productsHelper.getMasterProduct = (masterId, variationIdForFullInfo) => {
    const apiMasterProduct = ProductMgr.getProduct(masterId);

    if (!apiMasterProduct) throw new Error(productsHelper.publicErrors.invalidMasterIdMessae);

    const master = ProductFactory.createMasterProduct(apiMasterProduct);

    if (variationIdForFullInfo) {
        const apiVariationProduct = ProductMgr.getProduct(variationIdForFullInfo);

        if (!apiVariationProduct) return master;

        const variation = ProductFactory.createVariation(apiVariationProduct, apiMasterProduct);

        let variationIndex = master.variations.findIndex((v) => v.pid === variationIdForFullInfo);

        master.variations[variationIndex] = variation;
    }

    return master;
};

productsHelper.getVariation = (masterId, variationId) => {
    const apiMasterProduct = ProductMgr.getProduct(masterId);

    if (!apiMasterProduct) throw new Error(productsHelper.publicErrors.invalidMasterIdMessae);

    const apiVariationProduct = ProductMgr.getProduct(variationId);

    if (!apiVariationProduct) throw new Error(productsHelper.publicErrors.invalidVariationIdMessae);

    const variation = ProductFactory.createVariation(apiVariationProduct, apiMasterProduct);

    return variation;
};

module.exports = productsHelper;
