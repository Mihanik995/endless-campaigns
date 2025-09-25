const {Router} = require('express');

const simpleMissionsRouter = require('./simple-missions/routes')
const pairingsRouter = require('./pairings/routes')
const questionsRouter = require('./questions/routes')

const missionsRouter = new Router();

missionsRouter.use('/simple', simpleMissionsRouter)
missionsRouter.use('/pairings', pairingsRouter)
missionsRouter.use('/questions', questionsRouter)

module.exports = missionsRouter;