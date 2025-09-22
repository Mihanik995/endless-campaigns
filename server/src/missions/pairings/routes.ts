import type {Request, Response} from 'express';
import type {PlayersOnPairings} from '../../../generated/prisma'

const {Router} = require("express");
const {PrismaClient} = require("../../../generated/prisma");
const {v4: uuid} = require("uuid");
const {verifyToken} = require("../../auth/middleware")

require("dotenv").config();

const pairingsRouter = new Router();
const dbClient = new PrismaClient();

pairingsRouter.post('/', verifyToken, async (req: Request, res: Response) => {
    const {campaignId, periodId, playerIds, simpleMissionId} = req.body;
    try {
        const id = uuid()
        const pairing = await dbClient.pairing.create({
            data: {
                id, campaignId, periodId, simpleMissionId, players: {
                    create: playerIds.map((id: string) => {
                        return {player: {connect: {id}}}
                    })
                }
            }
        })
        res.status(201).json(pairing);
    } catch (error) {
        res.status(500).json({error})
    }
})

pairingsRouter.get('/:id', verifyToken, async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
        const pairing = await dbClient.pairing.findUnique({where: {id}})
        if (!pairing) return res.status(404).json({error: 'No pairing'})
        res.status(200).json(pairing);
    } catch (error) {
        res.status(500).json({error})
    }
})

pairingsRouter.get('/campaign/:campaignId', verifyToken, async (req: Request, res: Response) => {
    const {campaignId} = req.params;
    try {
        const pairing = await dbClient.pairing.findMany({
            where: {campaignId},
            include: {
                simpleMission: true,
                players: {include: {player: {
                            select: {id: true, username: true, email: true}
                        }}}
            }
        })
        if (!pairing) return res.status(404).json({error: 'No pairing'})
        res.status(200).json(pairing);
    } catch (error) {
        res.status(500).json({error})
    }
})

pairingsRouter.get('/period/:periodId', verifyToken, async (req: Request, res: Response) => {
    const {periodId} = req.params;
    try {
        const pairing = await dbClient.pairing.findMany({
            where: {periodId},
            include: {
                simpleMission: true,
                players: {include: {player: {
                            select: {id: true, username: true, email: true}
                        }}}}
        })
        if (!pairing) return res.status(404).json({error: 'No pairing'})
        res.status(200).json(pairing);
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
})

pairingsRouter.get('/player/:playerId', verifyToken, async (req: Request, res: Response) => {
    const {playerId} = req.params;
    try {
        const pairing = await dbClient.playersOnPairings.findMany({
            where: {playerId},
            include: {
                pairing: {
                    include: {
                        campaign: true,
                        simpleMission: true,
                    }
                }
            },
        })
        if (!pairing) return res.status(404).json({error: 'No pairing'})
        res.status(200).json(pairing);
    } catch (error) {
        res.status(500).json({error})
    }
})

pairingsRouter.put('/:id', verifyToken, async (req: Request, res: Response) => {
    const {id} = req.params;
    const {campaignId, periodId, playerIds, simpleMissionId} = req.body;
    try {
        const pairing = await dbClient.pairing.findUnique({where: {id}})
        if (!pairing) return res.status(404).json({error: 'No pairing'})
        const updatedPairing = await dbClient.pairing.update({
            where: {id},
            data: {
                campaignId, periodId, simpleMissionId,
                players: {
                    deleteMany: {},
                    create: playerIds.map((id: string) => {
                        return {player: {connect: {id}}}
                    })
                }
            },
        })
        res.status(200).json(updatedPairing);
    } catch (error) {
        res.status(500).json({error})
    }
})

pairingsRouter.delete('/:id', verifyToken, async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
        dbClient.pairing.delete({where: {id}})
            .then(() => res.sendStatus(204))
    } catch (error) {
        res.status(500).json({error})
    }
})

pairingsRouter.post('/:id/set-winner/', verifyToken, async (req: Request, res: Response) => {
    const {id} = req.params;
    const winnersIds: string[] = req.body.winnersIds
    try {
        const pairing = await dbClient.pairing.findUnique({
            where: {id},
            include: {
                players: {select: {playerId: true}}
            }
        })
        if (!pairing) return res.status(404).json({error: 'No pairing'})
        for (const playerId of winnersIds) {
            if (!pairing.players.map((p: PlayersOnPairings) => p.playerId).includes(playerId)) {
                return res.status(400).json({error: 'No such player in the pairing'})
            }
        }
        const updatedPairing = await dbClient.pairing.update({
            where: {id},
            data: {
                played: true,
                winners: {create: winnersIds.map((id: string) => {
                    return {winner: {connect: {id}}}
                })}
            }
        })
        res.status(200).json(updatedPairing);
    } catch (error) {
        res.status(500).json({error})
    }
})

module.exports = pairingsRouter