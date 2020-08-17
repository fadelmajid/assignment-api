"use strict"

const _ = require('underscore')

let obj = (rootpath) => {
    const fn = {}

    // BEGIN PROFILE
    fn.getProfile = async (req, res, next) => {
        try {
            let user_id = parseInt(req.objUser.user_id) || 0
            if (user_id <= 0) {
                throw getMessage('usr006')
            }

            let result = await req.model('user').getUser(user_id)
            if (isEmpty(result)) {
                throw getMessage('usr007')
            }

            // don't show the password when get profile
            delete result.user_password

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.updateProfile = async (req, res, next) => {
        try {
            let validator = require('validator')
            let user_id = parseInt(req.objUser.user_id) || 0
            if (user_id <= 0) {
                throw getMessage('usr006')
            }

            // Validate username length
            let name = (req.body.user_name || '').trim()
            if (!loadLib('validation').validName(name)) {
                throw getMessage('usr018')
            }

            let detailUser = await req.model('user').getUser(user_id)
            if (isEmpty(detailUser)) {
                throw getMessage('usr007')
            }

            let data = {
                user_name: name,
                user_email: (req.body.user_email || '').toLowerCase() || '',
                updated_date: moment().format('YYYY-MM-DD HH:mm:ss')
            }

            // validate name
            if (validator.isEmpty(data.user_name)) {
                throw getMessage('usr002')
            }
            // validate email
            if (validator.isEmpty(data.user_email)) {
                throw getMessage('usr003')
            }
            // validate email format
            if (!loadLib('validation').isValidEmail(data.user_email)) {
                throw getMessage('usr004')
            }
            // validate if email exists and not belong to logged in user
            let dupEmail = await req.model('user').getUserEmail(data.user_email)
            if (dupEmail && dupEmail.user_id !== user_id) {
                throw getMessage('usr005')
            }

            // insert data & get detail
            await req.model('user').updateUser(user_id, data)
            let result = await req.model('user').getUser(user_id)

            // don't show password
            delete result.user_password

            res.success(result)
        } catch(e) {next(e)}
    }
    // END PROFILE

    // START DATA
    fn.getUserData = async (req, res, next) => {
        try {
            let user_id = parseInt(req.objUser.user_id) || 0
            if (user_id <= 0) {
                throw getMessage('usr006')
            }
            let udata = parseInt(req.params.udata_id) || 0
            if (udata <= 0) {
                throw getMessage('udt001')
            }
            // validate if address exists
            let result = await req.model('user').getUserData(udata)
            if (!result) {
                throw getMessage('udt004')
            }
            // validate if address belongs to loggedin user using not found error message
            if (result.user_id != user_id) {
                throw getMessage('udt004')
            }

            res.success(result)
        } catch (e) {next(e)}
    }

    fn.getAllUserData = async (req, res, next) => {
        try {
            let user_id = parseInt(req.objUser.user_id) || 0
            if (user_id <= 0) {
                throw getMessage('usr006')
            }

            let keyword = req.query.keyword || ''
            keyword = '%' + keyword + '%'
            let where = ' AND is_deleted = $1 AND user_id = $2 AND (udata_username LIKE $3 OR udata_account LIKE $4) '
            let data = [false, user_id, keyword, keyword]
            let order_by = ' udata_id ASC '
            let result = await req.model('user').getAllUserData(where, data, order_by)

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.getPagingUserData = async (req, res, next) => {
        try {
            let user_id = parseInt(req.objUser.user_id) || 0
            if (user_id <= 0) {
                throw getMessage('usr006')
            }

            let keyword = req.query.keyword || ''
            keyword = '%' + keyword + '%'
            let where = ' AND is_deleted = $1 AND user_id = $2 AND (udata_username LIKE $3 OR udata_account LIKE $4) '
            let data = [false, user_id, keyword, keyword]
            let order_by = ' udata_id ASC '
            let page_no = req.query.page || 0
            let no_per_page = req.query.perpage || 0
            let result = await req.model('user').getPagingUserData(
                where,
                data,
                order_by,
                page_no,
                no_per_page
            )

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.createUserData = async (req, res, next) => {
        try {
            let validator = require('validator')
            let moment = require('moment')
            let now = moment().format('YYYY-MM-DD HH:mm:ss')

            let user_id = parseInt(req.objUser.user_id) || 0
            if (user_id <= 0) {
                throw getMessage('usr006')
            }

            // get parameter
            let account = (req.body.account || '').trim()
            let username = (req.body.username || '').trim()
            let password = (req.body.password || '')

            // Start Validate required
            if (validator.isEmpty(account)) {
                throw getMessage('udt001')
            }

            if (validator.isEmpty(username)) {
                throw getMessage('udt002')
            }

            if (validator.isEmpty(password)) {
                throw getMessage('udt003')
            }

            // set variable to insert
            let data = {
                user_id : user_id,
                udata_account : account,
                udata_username : username,
                udata_password : password,
                created_date : now
            }

            let udata_id = await req.model('user').insertUserData(data)
            let result = await req.model('user').getUserData(udata_id.udata_id)

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.updateUserData = async (req, res, next) => {
        try {
            let user_id = parseInt(req.objUser.user_id) || 0
            if (user_id <= 0) {
                throw getMessage('usr006')
            }
            let udata_id = parseInt(req.params.udata_id) || 0
            if (udata_id <= 0) {
                throw getMessage('udt001')
            }
            // validate if data exists
            let userdata = await req.model('user').getUserData(udata_id)
            if (!userdata) {
                throw getMessage('udt004')
            }
            // validate if data belongs to loggedin user
            if (userdata.user_id != user_id) {
                throw getMessage('udt005')
            }

            let data = {
                udata_account: (req.body.account || '').trim(),
                udata_username: (req.body.username || '').trim(),
                udata_password: (req.body.password || '').trim(),
                updated_date: moment().format('YYYY-MM-DD HH:mm:ss')
            }

            await req.model('user').updateUserData(udata_id, data)
            let result = await req.model('user').getUserData(udata_id)
            res.success(result)
        } catch(e) {next(e)}
    }

    fn.deleteUserData = async (req, res, next) => {
        try {
            let user_id = parseInt(req.objUser.user_id) || 0
            if (user_id <= 0) {
                throw getMessage('usr006')
            }
            let udata_id = parseInt(req.params.udata_id) || 0
            if (udata_id <= 0) {
                throw getMessage('udt001')
            }
            // validate if userdata exists
            let userdata = await req.model('user').getUserData(udata_id)
            if (!userdata) {
                throw getMessage('udt004')
            }
            // validate if userdata belongs to loggedin user
            if (userdata.user_id != user_id) {
                throw getMessage('udt006')
            }
            // validate userdata records must be more than 1 before delete
            let all_userdata = await req.model('user').getAllUserData(' AND is_deleted = $1 AND user_id = $2 ', [false, user_id])
            if (all_userdata.length < 1) {
                throw getMessage('udt009')
            }

            await req.model('user').deleteUserData(udata_id)
            res.success(getMessage('udt008'))
        } catch (e) {next(e)}
    }

    fn.deleteSoftUserData = async (req, res, next) => {
        try {
            let user_id = parseInt(req.objUser.user_id) || 0
            if (user_id <= 0) {
                throw getMessage('usr006')
            }
            let udata_id = parseInt(req.params.udata_id) || 0
            if (udata_id <= 0) {
                throw getMessage('udt001')
            }
            // validate if userdata exists
            let userdata = await req.model('user').getUserData(udata_id)
            if (!userdata) {
                throw getMessage('udt004')
            }
            // validate if userdata belongs to loggedin user
            if (userdata.user_id != user_id) {
                throw getMessage('udt006')
            }
            // validate if userdata already deleted or not
            if (userdata.is_deleted == true) {
                throw getMessage('udt010')
            }
            // validate userdata records must be more than 1 before delete
            let all_userdata = await req.model('user').getAllUserData(' AND is_deleted = $1 AND user_id = $2 ', [false, user_id])
            if (all_userdata.length < 1) {
                throw getMessage('udt009')
            }

            await req.model('user').deleteSoftUserData(udata_id, {is_deleted : true})
            res.success(getMessage('udt008'))
        } catch (e) {next(e)}
    }
    // END DATA

    // START SCHEDULE
    fn.getUserTask = async (req, res, next) => {
        try {
            let user_id = parseInt(req.objUser.user_id) || 0
            if (user_id <= 0) {
                throw getMessage('usr006')
            }
            let udata = parseInt(req.params.task_id) || 0
            if (udata <= 0) {
                throw getMessage('udt001')
            }
            // validate if address exists
            let result = await req.model('user').getUserTask(udata)
            if (!result) {
                throw getMessage('udt004')
            }
            // validate if address belongs to loggedin user using not found error message
            if (result.user_id != user_id) {
                throw getMessage('udt004')
            }

            res.success(result)
        } catch (e) {next(e)}
    }

    fn.getAllUserTask = async (req, res, next) => {
        try {
            let moment = require('moment')
            let user_id = parseInt(req.objUser.user_id) || 0
            if (user_id <= 0) {
                throw getMessage('usr006')
            }

            let location = req.query.location || ''
            let time = req.query.time || ''

            let where = ' AND is_deleted = $1 AND user_id = $2 '
            let data = [false, user_id]

            let counter = 3
            if(!_.isEmpty(location)){
                where += ' AND location LIKE $' + counter
                data.push('%' + location + '%')
                counter += 1
            }

            if(!_.isEmpty(time)){
                where += ' AND time >= $' + counter
                data.push(moment.utc(time).format('YYYY-MM-DDTHH:mm:ss.sssZ'))
            }

            let order_by = ' task_id DESC '
            let result = await req.model('user').getAllUserTask(where, data, order_by)

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.getPagingUserTask = async (req, res, next) => {
        try {
            let moment = require('moment')
            let user_id = parseInt(req.objUser.user_id) || 0
            if (user_id <= 0) {
                throw getMessage('usr006')
            }

            let location = req.query.location || ''
            let time = req.query.time || ''

            let where = ' AND is_deleted = $1 AND user_id = $2 '
            let data = [false, user_id]

            let counter = 3
            if(!_.isEmpty(location)){
                where += ' AND location LIKE $' + counter
                data.push('%' + location + '%')
                counter += 1
            }

            if(!_.isEmpty(time)){
                where += ' AND time >= $' + counter
                data.push(moment.utc(time).format('YYYY-MM-DDTHH:mm:ss.sssZ'))
            }

            let order_by = ' task_id DESC '
            let page_no = req.query.page || 0
            let no_per_page = req.query.perpage || 0
            let result = await req.model('user').getPagingUserTask(
                where,
                data,
                order_by,
                page_no,
                no_per_page
            )

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.createUserTask = async (req, res, next) => {
        try {
            let validator = require('validator')
            let moment = require('moment')
            let now = moment().format('YYYY-MM-DD HH:mm:ss')

            let user_id = parseInt(req.objUser.user_id) || 0
            if (user_id <= 0) {
                throw getMessage('usr006')
            }

            // get parameter
            let description = (req.body.description || '').trim()
            let location = (req.body.location || '')
            let start_at = (req.body.start_at || '')
            let end_at = (req.body.end_at || '')
         
            // set variable to insert
            let data = {
                user_id : user_id,
                description : description,
                location: location,
                time: moment.utc(start_at).format('YYYY-MM-DDTHH:mm:ss.sssZ'),
                start_at: moment.utc(start_at).format('YYYY-MM-DDTHH:mm:ss.sssZ'),
                end_at: moment.utc(end_at).format('YYYY-MM-DDTHH:mm:ss.sssZ'),
                status: 'INCOMPLETE',
                created_date: now
            }

            let udata_id = await req.model('user').insertUserTask(data)
            let result = await req.model('user').getUserTask(udata_id.task_id)
            res.success(result)
        } catch(e) {
            next(e)
        }
    // END SCHEDULE
    }

    fn.updateUserTask = async (req, res, next) => {
        try {
            let moment = require('moment')
            let user_id = parseInt(req.objUser.user_id) || 0
            if (user_id <= 0) {
                throw getMessage('usr006')
            }
            let task_id = parseInt(req.params.task_id) || 0
            if (task_id <= 0) {
                throw getMessage('udt001')
            }
            // validate if data exists
            let UserTask = await req.model('user').getUserTask(task_id)
            if (!UserTask) {
                throw getMessage('udt004')
            }
            
            // validate if data belongs to loggedin user
            if (UserTask.user_id != user_id) {
                throw getMessage('udt005')
            }

            let description = (req.body.description || UserTask.description).trim()
            let location = (req.body.location || UserTask.location)
            let start_at = (req.body.start_at || UserTask.start_at)
            let end_at = (req.body.end_at || UserTask.end_at)

            let data = {
                description: description,
                location: location,
                start_at: moment.utc(start_at).format('YYYY-MM-DDTHH:mm:ss.sssZ'),
                end_at: moment.utc(end_at).format('YYYY-MM-DDTHH:mm:ss.sssZ'),
                updated_date: moment().format('YYYY-MM-DD HH:mm:ss')
            }

            await req.model('user').updateUserTask(task_id, data)
            let result = await req.model('user').getUserTask(task_id)
            res.success(result)
        } catch(e) {next(e)}
    }

    fn.deleteUserTask = async (req, res, next) => {
        try {
            let user_id = parseInt(req.objUser.user_id) || 0
            if (user_id <= 0) {
                throw getMessage('usr006')
            }
            let task_id = parseInt(req.params.task_id) || 0
            if (task_id <= 0) {
                throw getMessage('udt001')
            }
            // validate if UserTask exists
            let UserTask = await req.model('user').getUserTask(task_id)
            if (!UserTask) {
                throw getMessage('udt004')
            }
            // validate if UserTask belongs to loggedin user
            if (UserTask.user_id != user_id) {
                throw getMessage('udt006')
            }
            // validate UserTask records must be more than 1 before delete
            let all_UserTask = await req.model('user').getAllUserTask(' AND is_deleted = $1 AND user_id = $2 ', [false, user_id])
            if (all_UserTask.length < 1) {
                throw getMessage('udt009')
            }

            await req.model('user').deleteUserTask(task_id)
            res.success(getMessage('udt008'))
        } catch (e) {next(e)}
    }

    fn.deleteSoftUserTask = async (req, res, next) => {
        try {
            let user_id = parseInt(req.objUser.user_id) || 0
            if (user_id <= 0) {
                throw getMessage('usr006')
            }
            let task_id = parseInt(req.params.task_id) || 0
            if (task_id <= 0) {
                throw getMessage('udt001')
            }
            // validate if UserTask exists
            let UserTask = await req.model('user').getUserTask(task_id)
            if (!UserTask) {
                throw getMessage('udt004')
            }
            // validate if UserTask belongs to loggedin user
            if (UserTask.user_id != user_id) {
                throw getMessage('udt006')
            }
            // validate if UserTask already deleted or not
            if (UserTask.is_deleted == true) {
                throw getMessage('udt010')
            }
            // validate UserTask records must be more than 1 before delete
            let all_UserTask = await req.model('user').getAllUserTask(' AND is_deleted = $1 AND user_id = $2 ', [false, user_id])
            if (all_UserTask.length < 1) {
                throw getMessage('udt009')
            }

            await req.model('user').deleteSoftUserTask(task_id, {is_deleted : true})
            res.success(getMessage('udt008'))
        } catch (e) {next(e)}
    }
    // END SCHEDULE

    return fn;
}
module.exports = obj