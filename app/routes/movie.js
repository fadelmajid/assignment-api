'use strict'

module.exports = (app) => {
    const movieController = app.controller('movie')

    let aRoutes = [
        // START DATA
        {method: 'get', route: '/search', inits: [], middlewares: [movieController.searchMovie], auth: 'no'},
        // {method: 'get', route: '/data/all', inits: [], middlewares: [movieController.getAllMovie], auth: 'login'},
        // {method: 'get', route: '/data', inits: [], middlewares: [movieController.getPagingMovie], auth: 'no'},
    ]
    return aRoutes
}
