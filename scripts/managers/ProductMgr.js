const products = require("~/db/products.json");

const ProductMgr = {};

ProductMgr.getProduct = (productId) => {
    return products.find((product) => product.id === productId);
};

ProductMgr.getAllProductes = () => products;

ProductMgr.getAllMasterProductes = () => products.filter((p) => p.isMaster);

ProductMgr.getMinMaxPrice = () => {
    const prices = products.map((p) => p.price);

    return [Math.min(...prices), Math.max(...prices)];
};

ProductMgr.getAllColors = () => {
    const colors = products.map((p) => p.custom.color).filter(c => !!c);

    return [...new Set(colors)];
};

ProductMgr.getAllSizes = () => {
    const sizes = products.map((p) => p.custom.size).filter(s => !!s);

    return [...new Set(sizes)];
};

module.exports = ProductMgr;
