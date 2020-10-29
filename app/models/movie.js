'use strict'
let obj = (objDB, db, rootpath) => {
    const tbl = require(rootpath + '/config/tables.json')
    const fn = {}

    // START LOG
    fn.insertMovieLog = async (data) => {
        let res = await objDB.insert(db, tbl.movie_log, data, "movie_log_id")
        return res
    }

    return fn
}

module.exports = obj
