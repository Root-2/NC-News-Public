// Require in models, as controllers call models.
const { send } = require("express/lib/response");
const {fetchArticle} = require("../models/articles.model")
const {fetchArticles} = require("../models/articles.model")
const {fetchCommentCount} = require("../models/comments.model")
const {doPatchArticle} = require("../models/articles.model")

exports.getArticle = (req, res, next) => {
    const commentCount = fetchCommentCount(req.params.article_id);
    const article = fetchArticle(req.params.article_id);
    Promise.all([commentCount, article])
    .then((values) => {
        values[1].comment_count = values[0]
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

exports.patchArticle = (req, res, next) => {
    if (!Number.isInteger(req.body.inc_votes)) {
        res.status(400).send({msg: "400 - Bad request - Bad patch object."})
    }
    doPatchArticle(req.params.article_id, req.body.inc_votes).then((data)=>{
        res.status(200).send(data)
    })
    .catch((err) => {
        next(err)
    })
}