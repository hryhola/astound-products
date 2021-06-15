const server = require("express")();

server.get("/api/tax", function (req, res) {
    log.info("Controller TaxApi is called");

    const { amount } = req.query;

    if(amount && !isNaN(amount)) res.json({ data: (amount * 0.05).toFixed(2) });
    else res.json({ error: "Invalid input"}); 
});

module.exports = server;
