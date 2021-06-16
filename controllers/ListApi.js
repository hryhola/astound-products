const productsHelper = require("~/scripts/helpers/productsHelper");
const pageHelper = require("~/scripts/helpers/pageHelper");
const server = require("express")();

server.get("/api/list", function (req, res) {
    log.info("Controller ListApi [/api/list] is called");

    if (req.url === "/api/list") {
        const data = productsHelper.getAllGroupedByMaster();
        res.json({ data });
    } else {
        const { name, priceFrom, priceTo, color, size, perPage, page, sortBy } = req.query;

        let data = productsHelper.getCertainProducts({
            refinements: {
                name,
                priceFrom: parseInt(priceFrom),
                priceTo: parseInt(priceTo),
                color: color && color.split(","),
                size: size && size.split(",")
            }
        });

        // if (sortBy) pageHelper.sortBy(data, sortBy);

        const { page: pageData, totalPages } = pageHelper.pagination(data, perPage, page)

        res.json({ data: pageData, totalPages });
    }
});

server.get("/api/list/refinements", function (_, res) {
    log.info("Controller ListApi [/api/list/refinements] refinement is called");

    const data = productsHelper.getRefinements();

    res.json({ data });
});

module.exports = server;
