const server = require('express')();

server.get('/basket', function (req, res) {
    log.info('Cotroller Basket is called')
    res.render('basket')
});

module.exports = server
