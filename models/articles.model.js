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

exports.fetchArticles = (queries) => {
    if(!('order' in queries)) {
        queries.order = 'desc'
    }
    if(!('sort_by' in queries)) {
        queries.sort_by = 'created_at'
    }
    if(!('topic' in queries)) {
        queries.topic = ''
    } else {queries.topic = `WHERE topic = '${queries.topic}'`}
    return db.query(`SELECT articles.article_id, articles.author, articles.created_at, title, articles.body, topic, articles.votes, 
    COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    ${queries.topic}
    GROUP BY articles.article_id
    ORDER BY ${queries.sort_by} ${queries.order};`).then(({rows})=>{
        if(rows.length === 0) {
            return Promise.reject({status: "404", text: "404 - No articles fit criteria."})
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

exports.deliverArticleComments = (comment, id)=> {
    const newComment = comment.body
    return db.query(`
        INSERT INTO comments (body, author, article_id)
        VALUES ('${newComment}', '${comment.username}', ${id.article_id})
        RETURNING *;`).then(({rows})=> {
            return rows[0]
        })
}