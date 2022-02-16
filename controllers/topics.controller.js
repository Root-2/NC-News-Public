// Require in models, as controllers call models.
const {fetchTopics} = require("../models/topics.model")

// Responds with 
exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics)=> {
        res.status(200).send({topics})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.badEndpoint = (req, res, next) => {
    res.status(404).send("Bad endpoint - File not found.")
}