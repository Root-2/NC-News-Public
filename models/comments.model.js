const { rows } = require("pg/lib/defaults");
const db = require("../db/connection");

exports.fetchCommentCount = (id) => {
    return db.query(`SELECT * FROM comments WHERE article_id=${id};`).then(({rows})=>{
        console.log("COMMENTCOUNT:", rows.length)
        return rows.length
    })
}