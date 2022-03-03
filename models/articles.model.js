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

exports.fetchArticles = () => {
    return db.query(`SELECT * FROM articles
                    ORDER BY created_at DESC;`)
        .then((articles) => {
            articles.rows.map((article) => article.comment_count = 0)
            return db.query(`SELECT * FROM comments;`)
                .then((comments) => {
                    comments.rows.forEach(comment => {
                            articles.rows[comment.article_id - 1].comment_count += 1
                    });
                    return articles.rows
                })
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

exports.deliverArticleComments = (comment, id)=> {
    const newComment = comment.body
    console.log(comment)
    return db.query(`
        INSERT INTO comments (body, author, article_id)
        VALUES ('${newComment}', '${comment.username}', ${id.article_id})
        RETURNING *;`).then(({rows})=> {
            console.log(rows[0])
            return rows[0]
        })
}