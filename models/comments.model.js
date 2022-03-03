const { rows } = require("pg/lib/defaults");
const db = require("../db/connection");


exports.fetchCommentCount = (id) => {
    return db.query(`SELECT * FROM comments WHERE article_id=${id};`).then(({rows})=>{
        return rows.length
    })
}

exports.fetchArticleComments = (id) => {
    return db.query(`
    SELECT comment_id, votes, created_at, author, body 
    FROM comments WHERE article_id=${id};`).then(({rows})=>{
        return rows
    })
}