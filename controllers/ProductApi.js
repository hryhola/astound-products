const productsHelper = require("~/scripts/helpers/productsHelper");
const { invalidMasterIdMessae, invalidVariationIdMessae } = require("~/scripts/helpers/productsHelper").publicErrors;
const server = require("express")();

server.get("/api/product/:id", function (req, res) {
    log.info("Controller ProductApi [/api/product/:id/:pid] is called");
    try {
        const product = productsHelper.getMasterProduct(req.params.id, req.query.pid);

        res.json({ data: product });
    } catch (e) {
        if (e.message === invalidMasterIdMessae || e.message === invalidVariationIdMessae) res.json({ error: e.message });
        else res.json({ error: "Server error." });
    }
});

server.get("/api/variation/:id/:pid", function (req, res) {
    log.info("Controller ProductApi [/api/variation/:id/:pid] is called");

    try {
        const product = productsHelper.getVariation(req.params.id, req.params.pid);

        res.json({ data: product });
    } catch (e) {
        if (e.message === invalidMasterIdMessae || e.message === invalidVariationIdMessae) res.json({ error: e.message });
        else res.json({ error: "Server error." });
    }
});

module.exports = server;
