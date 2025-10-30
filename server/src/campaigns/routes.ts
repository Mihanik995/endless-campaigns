import type {Request, Response, NextFunction} from "express";
import type {CampaignRegister, Campaign} from "../../generated/prisma";

const {Router} = require("express");
const {PrismaClient} = require("../../generated/prisma")
const {verifyToken} = require('../auth/middleware')
const jwt = require('jsonwebtoken');
const {v4: uuid} = require('uuid');

const campaignRegisterRouter = require('./register/routes')
const periodsRouter = require('./periods/routes')
const notificationsRouter = require('./notifications/routes')

require('dotenv').config();

const dbClient = new PrismaClient();
const campaignsRouter = new Router();

campaignsRouter.use('/register', campaignRegisterRouter);
campaignsRouter.use('/periods', periodsRouter);
campaignsRouter.use('/notifications', notificationsRouter);

campaignsRouter.get("/", verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET);
        const campaignsUserOwns = await dbClient.campaign.findMany({where: {ownerId: userId}}) as Campaign[]
        const userRegs = await dbClient.campaignRegister.findMany({where: {playerId: userId}}) as CampaignRegister[]
        const campaignsUserParticipates = await Promise.all(userRegs.map(async reg =>
                dbClient.campaign.findUnique({where: {id: reg.campaignId}}))) as Campaign[]
        const dupsFilter = new Set()
        const campaigns: Campaign[] = [...campaignsUserOwns, ...campaignsUserParticipates]
            .filter(camp => {
                if (dupsFilter.has(camp.id)) {
                    return false
                }
                dupsFilter.add(camp.id)
                return true
            })
        return res.status(200).json(campaigns)
    } catch (error) {
        next(error)
    }
})

campaignsRouter.get("/:id", verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const campaignId = req.params.id;
    try {
        const campaign = await dbClient.campaign.findUnique({
            where: {id: campaignId},
            include: {customNotifications: true}
        })
        if (!campaign) return res.status(404).json({error: 'Campaign not found'})
        return res.status(200).json(campaign)
    } catch (error) {
        next(error)
    }
})

campaignsRouter.post("/", verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    const campaignData = req.body
    try {
        const {userId: ownerId} = jwt.verify(token, process.env.JWT_SECRET);

        campaignData["ownerId"] = ownerId;
        campaignData["id"] = uuid();

        campaignData.dateStart = new Date(campaignData.dateStart)
        campaignData.dateEnd = new Date(campaignData.dateEnd)

        const campaign = await dbClient.campaign.create({data: campaignData})
        return res.status(201).json(campaign)
    } catch (error) {
        next(error)
    }
})

campaignsRouter.put("/:id", verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    const campaignId = req.params.id;
    const campaignData = req.body

    if (campaignData.dateStart) campaignData.dateStart = new Date(campaignData.dateStart)
    if (campaignData.dateEnd) campaignData.dateEnd = new Date(campaignData.dateEnd)
    delete campaignData.customNotifications

    try {
        const {userId: ownerId} = jwt.verify(token, process.env.JWT_SECRET);
        const campaign = await dbClient.campaign.update({where: {ownerId, id: campaignId}, data: campaignData})
        return res.status(200).json(campaign)
    } catch (error) {
        next(error)
    }
})

campaignsRouter.delete("/:id", verifyToken, (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    const campaignId = req.params.id;
    try {
        const {userId: ownerId} = jwt.verify(token, process.env.JWT_SECRET);
        dbClient.campaign.delete({where: {ownerId, id: campaignId}})
            .then(() => res.sendStatus(204))
    } catch (error) {
        next(error)
    }
})

module.exports = campaignsRouter