// Require in models, as controllers call models.
const { send } = require("express/lib/response");
const {fetchArticle} = require("../models/articles.model")
const {fetchArticles} = require("../models/articles.model")
const {fetchCommentCount} = require("../models/comments.model")

exports.getArticle = (req, res, next) => {
    // const commentCount = Promise.resolve(4)
    // const article = Promise.resolve(3)
    const commentCount = fetchCommentCount(req.params.article_id);
    const article = fetchArticle(req.params.article_id);
    console.log(commentCount, article);
    Promise.all([commentCount, article])
    .then((values) => {
        values[1].comment_count = values[0]
        console.log(values[1])
        res.status(200).send(values[1])
    })
    .catch((err) => {
        next(err)
    })
};

exports.getArticles = (req, res, next) => {
    fetchArticles().then((data)=> {
        res.status(200).send(data)
    })
}