const productsHelper = require('~/scripts/helpers/productsHelper')
const server = require('express')()

server.get('/list', function (req, res) {
    log.info('Controller Home is called')

    res.render('list')
});

module.exports = server

