import type {Request, Response} from 'express'
import type {Campaign} from "../../../generated/prisma";

const {Router} = require('express')
const {PrismaClient} = require('../../../generated/prisma')
const jwt = require('jsonwebtoken')
const {v4: uuid} = require('uuid')

const {verifyToken} = require('../../auth/middleware')
const {newRegisterNotify} = require('../../utils/notifications')

require('dotenv').config()

const campaignRegisterRouter = new Router()
const dbClient = new PrismaClient()

campaignRegisterRouter.post('/', verifyToken, async (req: Request, res: Response) => {
    const token = req.header('Authorization')
    const {campaignId, formationName, rosterLink} = req.body
    try {
        const {userId: playerId} = jwt.verify(token, process.env.JWT_SECRET)
        const alreadyExists = await dbClient.campaignRegister.findMany({where: {playerId, campaignId}})
        if (alreadyExists.length) return res.status(400).json({error: 'This player already registered'})
        const campaign = await dbClient.campaign.findUnique({
            where: {id: campaignId},
            include: {owner: true}
        }) as Campaign
        if (!campaign) return res.status(404).json({error: 'Campaign not found'})
        const approved = !campaign.requiresRegisterApproval
        const id = uuid()
        const register = await dbClient.campaignRegister.create({
            data: {id, campaignId, playerId, formationName, rosterLink, approved},
            include: {player: {select: {username: true}}}
        })
        await newRegisterNotify(campaign, register)
        res.status(201).json(register)
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
})

campaignRegisterRouter.get('/campaign/:id', verifyToken, async (req: Request, res: Response) => {
    const {id} = req.params
    try {
        const regs = await dbClient.campaignRegister.findMany({
            where: {campaignId: id},
            include: {player: {select: {id: true, username: true, email: true}}},
        })
        res.status(200).json(regs)
    } catch (error) {
        res.status(500).json({error})
    }
})

campaignRegisterRouter.get('/user/:id', verifyToken, async (req: Request, res: Response) => {
    const {id} = req.params
    try {
        const regs = await dbClient.campaignRegister.findMany({
            where: {playerId: id},
            include: {campaign: true}
        })
        return res.status(200).json(regs)
    } catch (error) {
        res.status(500).json({error})
    }
})

campaignRegisterRouter.put('/:id', verifyToken, async (req: Request, res: Response) => {
    const {id} = req.params
    const data = req.body
    try {
        const reg = await dbClient.campaignRegister.update({where: {id}, data})
        res.status(200).json(reg)
    } catch (error) {
        res.status(500).json({error})
    }
})

campaignRegisterRouter.delete('/:id', verifyToken, async (req: Request, res: Response) => {
    const {id} = req.params
    try {
        dbClient.campaignRegister.delete({where: {id}})
            .then(() => res.sendStatus(204))
    } catch (error) {
        res.status(500).json({error})
    }
})

module.exports = campaignRegisterRouter