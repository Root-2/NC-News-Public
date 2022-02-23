const { rows } = require("pg/lib/defaults");
const db = require("../db/connection");

exports.fetchArticle = (id) => {
    // Rejects with 400 if input is not a number.
    if(!Number(id)) {
        return Promise.reject({status: "400", text: "400 - Bad request, ID should be a number."})

    } else { 
    // Goes to model for query.
    return db.query(`SELECT * FROM articles WHERE article_id=${id};`).then(({rows})=>{
        // Rejects if there's nothing at the ID requested.
        if(rows.length === 0) {
            return Promise.reject({status: "404", text: "404 - No article at ID."})
        // Returns specific object when found.
        } else {
            console.log("ARTICLES SUCCESSFUL")
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