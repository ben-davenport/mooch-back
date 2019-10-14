const mysql = require('mysql')
const db = require('./config').db
const pool = mysql.createPool(db)

module.exports={
    query: (queryText, params, callback)=>{
        console.log(queryText)
        return pool.query(queryText, params, callback)
    }
}