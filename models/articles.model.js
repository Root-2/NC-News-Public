const { rows, database } = require("pg/lib/defaults");
const db = require("../db/connection");

exports.fetchArticle = (id) => {
    if(!Number(id)) {
        return Promise.reject({status: "400", text: "400 - Bad request, ID should be a number."})
    } else { 
    return db.query(`SELECT * FROM articles WHERE article_id=${id};`).then(({rows})=>{
        if(rows.length === 0) {
            return Promise.reject({status: "404", text: "404 - No article at ID."})
        } else {
        return rows[0] 
        }
    })
}
}

exports.fetchArticles = ()=>{
    return db.query(`SELECT * FROM articles;`).then(({rows})=>{
        if(rows.length === 0) {
            return Promise.reject({status: "404", text: "404 - No articles in database."})
        } else {
            return rows
        }
    })
}

exports.doPatchArticle = (id, votes)=> {
    if(!Number(id)) {
        return Promise.reject({status: "400", text: "400 - Bad request, ID should be a number."})
    } else { 
    return db.query(`
    UPDATE articles 
    SET votes = votes + ${votes}
    WHERE article_id=${id}
    RETURNING *;`).then(({rows})=> {
        if(rows.length === 0) {
            return Promise.reject({status: "404", text: "404 - No article at ID."})
        } else {
        return rows[0]
        }
    })
}}