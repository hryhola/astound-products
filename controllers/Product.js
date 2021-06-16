const productsMgr = require("~/scripts/managers/ProductMgr");
const server = require("express")();

server.get("/product/:id", function (req, res) {
    log.info("Controller Product [/product/:id] is called");
    
    const product = productsMgr.getProduct(req.params.id);

    if (!product || product.variations.length === 0) res.render("productDoNotExist");
    else res.render("product");
});

module.exports = server;
