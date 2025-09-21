const {Router} = require('express');

const simpleMissionsRouter = require('./simple-missions/routes')

const missionsRouter = new Router();

missionsRouter.use('/simple', simpleMissionsRouter)

module.exports = missionsRouter;