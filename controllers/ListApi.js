const productsHelper = require("~/scripts/helpers/productsHelper");
const server = require("express")();

server.get("/api/list", function (req, res) {
    log.info("Controller ListApi [/api/list] is called");

    if (req.url === "/api/list") {
        const data = productsHelper.getAllGroupedByMaster();
        res.json({ data });
    } else {
        const refinements = {
            name: req.query.name,
            priceFrom: parseInt(req.query.priceFrom),
            priceTo: parseInt(req.query.priceTo),
            color: req.query.color && req.query.color.split(","),
            size: req.query.size && req.query.size.split(",")
        };
        
        const data = productsHelper.getCertainProducts({
            refinements
        });

        res.json({ data });
    }
});

server.get("/api/list/refinements", function (_, res) {
    log.info("Controller ListApi [/api/list/refinements] refinement is called");

    const data = productsHelper.getRefinements();

    res.json({ data });
});

module.exports = server;
