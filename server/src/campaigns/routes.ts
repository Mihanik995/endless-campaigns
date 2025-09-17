import type {Request, Response} from "express";
import type {CampaignRegister, Campaigns} from "../../generated/prisma";

const {Router} = require("express");
const {PrismaClient} = require("../../generated/prisma")
const {verifyToken} = require('../auth/middleware')
const jwt = require('jsonwebtoken');
const {v4: uuid} = require('uuid');

const campaignRegisterRouter = require('./campaign-register/routes')

require('dotenv').config();

const dbClient = new PrismaClient();
const campaignsRouter = new Router();

campaignsRouter.use('/register', campaignRegisterRouter);

campaignsRouter.get("/", verifyToken, async (req: Request, res: Response) => {
    const token = req.header('Authorization');
    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET);
        const campaignsUserOwns = await dbClient.campaigns.findMany({where: {ownerId: userId}}) as Campaigns[]
        const userRegs = await dbClient.campaignRegister.findMany({where: {playerId: userId}}) as CampaignRegister[]
        const campaignsUserParticipates = await Promise.all(userRegs.map(async reg =>
                dbClient.campaigns.findUnique({where: {id: reg.campaignId}}))) as Campaigns[]
        const campaigns: Campaigns[] = [...new Set([...campaignsUserOwns, ...campaignsUserParticipates])]
        return res.status(200).json(campaigns)
    } catch (error) {
        res.status(500).json({error})
    }
})

campaignsRouter.get("/:id", verifyToken, async (req: Request, res: Response) => {
    const campaignId = req.params.id;
    try {
        const campaign = await dbClient.campaigns.findUnique({where: {id: campaignId}})
        return res.status(200).json(campaign)
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
})

campaignsRouter.post("/", verifyToken, async (req: Request, res: Response) => {
    const token = req.header('Authorization');
    const campaignData = req.body
    try {
        const {userId: ownerId} = jwt.verify(token, process.env.JWT_SECRET);

        campaignData["ownerId"] = ownerId;
        campaignData["id"] = uuid();

        campaignData.dateStart = new Date(campaignData.dateStart)
        campaignData.dateEnd = new Date(campaignData.dateEnd)

        const campaign = await dbClient.campaigns.create({data: campaignData})
        return res.status(201).json(campaign)
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
})

campaignsRouter.put("/:id", verifyToken, async (req: Request, res: Response) => {
    const token = req.header('Authorization');
    const campaignId = req.params.id;
    const campaignData = req.body as Campaigns
    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET);
        const campaign = await dbClient.campaigns.update({where: {userId, id: campaignId}, data: campaignData})
        return res.status(200).json(campaign)
    } catch (error) {
        res.status(500).json({error})
    }
})

campaignsRouter.delete("/:id", verifyToken, (req: Request, res: Response) => {
    const token = req.header('Authorization');
    const campaignId = req.params.id;
    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET);
        dbClient.campaigns.delete({where: {userId, id: campaignId}})
            .then(() => res.sendStatus(204))
    } catch (error) {
        res.status(500).json({error})
    }
})

module.exports = campaignsRouter