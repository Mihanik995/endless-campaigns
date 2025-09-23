const {Router} = require('express');

const simpleMissionsRouter = require('./simple-missions/routes')
const pairingsRouter = require('./pairings/routes')

const missionsRouter = new Router();

missionsRouter.use('/simple', simpleMissionsRouter)
missionsRouter.use('/pairings', pairingsRouter)

module.exports = missionsRouter;