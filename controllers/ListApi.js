const productsHelper = require("~/scripts/helpers/productsHelper");
const server = require("express")();

server.get("/api/list", function (_, res) {
    log.info("Controller ListApi is called");

    const data = productsHelper.getAllGroupedByMaster();

    res.json({ data });
});

module.exports = server;
