const products = require('~/db/products.json');

const ProductMgr = {};

ProductMgr.getProduct = (productId) => {
    return products.find((product) => product.id === productId);
};

ProductMgr.getAllProductes = () => products;

ProductMgr.getAllMasterProductes = () => products.filter(p => p.isMaster);




module.exports = ProductMgr;
