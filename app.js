// Require in core dependancies: 
// Express for server-based testing.
// App is a copy of Express?
// getTopics is being pulled from the controller file with destructuring method.

const express = require('express');
const res = require('express/lib/response');
const app = express();
app.use(express.json());
const {getTopics} = require ('./controllers/topics.controller');
const {badEndpoint} = require ('./controllers/topics.controller');
const {getArticle} = require ('./controllers/articles.controller');
const {getUsers} = require ('./controllers/users.controller');
const {getArticles} = require('./controllers/articles.controller');
const {patchArticle} = require('./controllers/articles.controller');
const {getArticleComments} = require ('./controllers/articles.controller');

// Designate api/topics endpoint to go use getTopics controller.
app.get(`/api/topics`, getTopics)

app.get(`/api/articles`, getArticles)
app.get(`/api/articles/:article_id`, getArticle)
app.get(`/api/articles/:article_id/comments`, getArticleComments)

app.patch(`/api/articles/:article_id`, patchArticle)

app.get(`/api/users`, getUsers)

//Catch endpoint for any bad paths.
app.all(`/*`, badEndpoint)


app.use((err, req, res, next)=>{
    res.status(err.status).send(err.text)
})


// Export all app functions to be called by controllers.
module.exports = app