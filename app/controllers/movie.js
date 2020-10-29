"use strict"

const _ = require('underscore')
const request = require('axios')
const config = require('../../config/config.json')
const validator = require('validator')
const movie = require('../routes/movie')

let obj = (rootpath) => {
    const fn = {}

    fn.searchMovie = async (req, res, next) => {
        try {
            let search = req.query.s || ''
            let p = req.query.page || 1

            console.log(search)
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

            // log to database

            res.success(result.data)
        } catch (e) {next(e)}
    }


    fn.getMovie = async (req, res, next) => {
        try {
            let movie_id = req.query.i || ''
            let title = req.query.t || ''

            // validate search
            if(validator.isEmpty(movie_id) && validator.isEmpty(title)){
                throw getMessage('Movie ID / title tidak boleh kosong')
            }

            let data = {
                url: config.movie_url,
                options: {
                    headers: {
                        'Content-Type': 'application/json;'
                    }
                }
            }

            let result = await request.get(`${data.url}?apikey=${config.api_key}&i=${movie_id}&t=${title}`, data.options);
            
            // validate response
            if(result.data.Response == "False"){
                throw getMessage('Not found')
            }

            // log to database

            res.success(result.data)
        } catch (e) {next(e)}
    }

    return fn;
}

module.exports = obj