"use strict"

const _ = require('underscore')
const request = require('axios')
const config = require('../../config/config.json')
const validator = require('validator')

let obj = (rootpath) => {
    const fn = {}

    fn.searchMovie = async (req, res, next) => {
        try {
            let search = req.query.s || ''
            let p = req.query.page || 1

            // validate search
            if(validator.isEmpty(search)){
                throw getMessage('Search tidak boleh kosong')
            }

            let data = {
                url: config.movie_url,
                options: {
                    headers: {
                        'Content-Type': 'application/json;'
                    }
                }
            }

            let result = await request.get(`${data.url}?apikey=${config.api_key}&s=${search}&page=${p}`, data.options);

            // validate response
            if(result.data.Response == "False"){
                throw getMessage('Not found')
            }

            res.success(result.data)
        } catch (e) {next(e)}
    }

    fn.getAllMovie = async (req, res, next) => {
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

    fn.getPagingMovie = async (req, res, next) => {
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

    return fn;
}

module.exports = obj