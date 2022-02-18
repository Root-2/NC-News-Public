// Require in models, as controllers call models.
const {fetchArticle} = require("../models/articles.model")


exports.getArticle = (req, res, next) => {
    fetchArticle(req.params.article_id).then((article) => {
        res.status(200).send(article.rows[0])
    })  
    .catch((err) => {
        if (err = 404) {
            res.status(404).send("404 - No article at ID.")
        }
    })
};