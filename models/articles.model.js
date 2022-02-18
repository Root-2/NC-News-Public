const db = require("../db/connection");

exports.fetchArticle = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id=${id};`).then(({rows})=>{
        if(rows.length = 0) {
            throw err(404)
        } else {
        return {rows} 
        }
    })
}