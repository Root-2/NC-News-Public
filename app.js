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


// Designate api/topics endpoint to go use getTopics controller.
app.get(`/api/topics`, getTopics)

//Catch endpoint for any bad paths.
app.all(`/*`, badEndpoint)


// Export all app functions to be called by controllers.
module.exports = app