import type {Request, Response, NextFunction} from "express";
import type {Campaign} from "../../../generated/prisma";

const {Router} = require("express")
const {PrismaClient} = require("../../../generated/prisma")
const jwt = require('jsonwebtoken')
const {verifyToken} = require("../../auth/middleware")

require("dotenv").config();

const periodsRouter = Router();
const dbClient = new PrismaClient();

periodsRouter.post('/', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const token = req.header('Authorization');
    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET);
        const campaign = await dbClient.campaign.findUnique({where: {id: data.campaignId}}) as Campaign;
        if (!campaign) return res.status(404).json({error: "Campaign not found"});
        if (userId !== campaign.ownerId) return res.status(403).json({error: "Access denied"});

        data.dateStart = new Date(data.dateStart)
        data.dateEnd = new Date(data.dateEnd)
        const period = await dbClient.campaignPeriod.create({
            data,
            include: {pairing: true},
        })
        return res.status(200).json(period)
    } catch (error) {
        next(error)
    }
})

periodsRouter.get('/:campaignId', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const {campaignId} = req.params;
    try {
        const periods = await dbClient.campaignPeriod.findMany({where: {campaignId}});
        return res.status(200).json(periods)
    } catch (error) {
        next(error)
    }
})

periodsRouter.put('/:id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const data = req.body;
    if (data.dateStart) data.dateStart = new Date(data.dateStart)
    if (data.dateEnd) data.dateEnd = new Date(data.dateEnd)
    try {
        const period = await dbClient.campaignPeriod.update({
            where: {id},
            data: {...data, pairing: undefined},
            include: {
                pairing: {
                    include: {
                        mission: {include: {nodes: true}},
                        players: {
                            include: {
                                player: {select: {id: true, username: true, email: true}},
                                personalMission: true
                            }
                        },
                        winners: {include: {player: {select: {id: true, username: true, email: true}}}}
                    }
                }
            }
        });
        if (!period) return res.status(404).json({error: "Period not found"});
        return res.status(200).json(period)
    } catch (error) {
        next(error)
    }
})

periodsRouter.delete('/:id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    dbClient.campaignPeriod.delete({where: {id}})
        .then(() => res.sendStatus(204))
        .catch((error: Error) => next(error))
})

module.exports = periodsRouter