'use strict'

module.exports = (app) => {
    const movieController = app.controller('movie')

    let aRoutes = [
        // START DATA
        {method: 'get', route: '/search', inits: [], middlewares: [movieController.searchMovie], auth: 'login'},
        {method: 'get', route: '/detail', inits: [], middlewares: [movieController.getMovie], auth: 'login' }
    ]
    return aRoutes
}
