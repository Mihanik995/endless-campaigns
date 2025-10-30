import type {Request, Response, NextFunction} from 'express'
import type {Campaign, CampaignRegister, Pairing} from "../../../generated/prisma";

const {Router} = require('express')
const {PrismaClient} = require('../../../generated/prisma')
const jwt = require('jsonwebtoken')
const {v4: uuid} = require('uuid')

const {verifyToken} = require('../../auth/middleware')
const {newRegisterNotify} = require('../../utils/notifications')

require('dotenv').config()

const campaignRegisterRouter = new Router()
const dbClient = new PrismaClient()

campaignRegisterRouter.post('/', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
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
        next(error)
    }
})

campaignRegisterRouter.get('/campaign/:id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params
    try {
        const regs = await dbClient.campaignRegister.findMany({
            where: {campaignId: id},
            include: {player: {select: {id: true, username: true, email: true}}},
        })
        res.status(200).json(regs)
    } catch (error) {
        next(error)
    }
})

campaignRegisterRouter.get('/user/:id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params
    try {
        const regs = await dbClient.campaignRegister.findMany({
            where: {playerId: id},
            include: {campaign: true}
        })
        return res.status(200).json(regs)
    } catch (error) {
        next(error)
    }
})

campaignRegisterRouter.put('/:id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params
    const data = req.body
    try {
        const reg = await dbClient.campaignRegister.update({where: {id}, data})
        res.status(200).json(reg)
    } catch (error) {
        next(error)
    }
})

campaignRegisterRouter.delete('/:id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params
    try {
        const reg: CampaignRegister = await dbClient.campaignRegister.findUnique({where: {id}})
        const pairingsToDelete: Pairing[] = await dbClient.pairing.findMany({
            where: {
                campaignId: reg.campaignId,
                players: {some: {playerId: reg.playerId}}
            }
        });
        const pairingIds = pairingsToDelete.map(p => p.id);
        await dbClient.pairing.deleteMany({where: {id: { in: pairingIds }}})
        await dbClient.campaignRegister.delete({where: {id}})
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})

module.exports = campaignRegisterRouter