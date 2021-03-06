// Require in models, as controllers call models.
const {send} = require("express/lib/response");
const {fetchArticle} = require("../models/articles.model")
const {fetchArticles} = require("../models/articles.model")
const {fetchArticleComments} = require("../models/comments.model")
const {fetchCommentCount} = require("../models/comments.model")
const {doPatchArticle} = require("../models/articles.model")
const {deliverArticleComments} = require("../models/articles.model")
const {readFile} = require("fs")
const fs = require("fs/promises")

exports.getAPI = (req, res, next) => {
    fs.readFile("controllers/endpoints.json")
    .then((data)=> {
        return(JSON.parse(data))
    })
    .then((data)=> {
        res.status(200).send(data)
    })
}

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
    fetchArticles(req.query).then((data)=> {
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

exports.getArticleComments = (req, res, next) => {
    fetchArticleComments(req.params.article_id).then((data)=>{
        
        res.status(200).send(data)
    })
    .catch((err) => {
        next(err)
    })
}

exports.postArticleComments = (req, res, next) => {
    deliverArticleComments(req.body, req.params).then((data)=>{
        res.status(200).send(data)
    })
    .catch((err) => {
        next(err)
    })
}