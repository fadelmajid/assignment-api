'use strict'

module.exports = (app) => {
    const userController = app.controller('user')

    let aRoutes = [
        // START PROFILE
        {method: 'get', route: '/profile', inits: [], middlewares: [userController.getProfile], auth: 'login'},
        {method: 'put', route: '/profile', inits: [], middlewares: [userController.updateProfile], auth: 'login'},
        // END PROFILE

        // START DATA
        {method: 'get', route: '/data/all', inits: [], middlewares: [userController.getAllUserData], auth: 'login'},
        {method: 'get', route: '/data/:udata_id', inits: [], middlewares: [userController.getUserData], auth: 'login'},
        {method: 'get', route: '/data', inits: [], middlewares: [userController.getPagingUserData], auth: 'login'},
        {method: 'post', route: '/data', inits: [], middlewares: [userController.createUserData], auth: 'login'},
        {method: 'put', route: '/data/:udata_id', inits: [], middlewares: [userController.updateUserData], auth: 'login'},
        {method: 'delete', route: '/data/:udata_id', inits: [], middlewares: [userController.deleteUserData], auth: 'login'},
        {method: 'delete', route: '/data/temp/:udata_id', inits: [], middlewares: [userController.deleteSoftUserData], auth: 'login'},
        // END DATA

        // START TASK
        {method: 'get', route: '/task/all', inits: [], middlewares: [userController.getAllUserTask], auth: 'login'},
        {method: 'get', route: '/task/:task_id', inits: [], middlewares: [userController.getUserTask], auth: 'login'},
        {method: 'get', route: '/task', inits: [], middlewares: [userController.getPagingUserTask], auth: 'login'},
        {method: 'post', route: '/task', inits: [], middlewares: [userController.createUserTask], auth: 'login'},
        {method: 'put', route: '/task/:task_id', inits: [], middlewares: [userController.updateUserTask], auth: 'login'},
        {method: 'delete', route: '/task/:task_id', inits: [], middlewares: [userController.deleteUserTask], auth: 'login'},
        {method: 'delete', route: '/task/temp/:task_id', inits: [], middlewares: [userController.deleteSoftUserTask], auth: 'login'},
        // END TASK
    ]
    return aRoutes
}
