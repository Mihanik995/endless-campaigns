import type {Request, Response} from 'express'

const {Router} = require('express')
const {PrismaClient} = require('../../../generated/prisma')
const {verifyToken} = require('../../auth/middleware')
const jwt = require('jsonwebtoken')
const {customNotification} = require('../../utils/notifications')

require('dotenv').config()

const notificationsRouter = new Router()
const dbClient = new PrismaClient()

notificationsRouter.post('/', verifyToken, async (req: Request, res: Response) => {
    const data = req.body
    const token = req.header('Authorization')
    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET)
        const campaign = await dbClient.campaign.findUnique({
            where: {id: data.campaignId},
            include: {campaignRegisters: {include: {player: true}}}
        })
        if (!campaign) return res.status(404).send('No campaign found')
        if (campaign.ownerId !== userId) return res.status(403).send('Access denied')
        const notification = await dbClient.customNotification.create({data})
        await customNotification(campaign, notification)
        return res.status(201).send(notification)
    } catch (error) {
        res.status(500).send({error})
    }
})

module.exports = notificationsRouter