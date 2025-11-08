import type {Request, Response, NextFunction} from 'express';
import type {PlayersOnPairings} from '../../../generated/prisma'

const {Router} = require("express");
const {PrismaClient} = require("../../../generated/prisma");
const {v4: uuid} = require("uuid");
const jwt = require("jsonwebtoken");
const {verifyToken} = require("../../auth/middleware")
const {resultsRejectedNotify, newPairingNotify, pairingPlayedNotify} = require('../../utils/notifications')

require("dotenv").config();

const pairingsRouter = new Router();
const dbClient = new PrismaClient();

pairingsRouter.post('/', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const {campaignId, periodId, players, missionId} = req.body;
    try {
        const id = uuid()
        const pairing = await dbClient.pairing.create({
            data: {
                id, campaignId, periodId, missionId, players: {
                    create: players.map((player: { playerId: string, personalMissionId: string }) => {
                        return player.personalMissionId
                            ? {
                                player: {connect: {id: player.playerId}},
                                personalMission: {connect: {id: player.personalMissionId}}
                            }
                            : {player: {connect: {id: player.playerId}}}
                    })
                }
            },
            include: {
                players: {
                    include: {
                        player: {
                            select: {
                                notifications: true,
                                telegramId: true,
                                email: true,
                                username: true,
                                id: true
                            }
                        },
                        personalMission: true
                    }
                },
                campaign: true,
                mission: {include: {nodes: true}},
                winners: {include: {player: {select: {id: true, username: true, email: true}}}}
            }
        })
        await newPairingNotify(pairing)
        res.status(201).json(pairing);
    } catch (error) {
        next(error)
    }
})

pairingsRouter.get('/:id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    try {
        const pairing = await dbClient.pairing.findUnique({
            where: {id},
            include: {
                mission: {include: {nodes: {include: {nextLinks: {include: {to: true}}}}}},
                campaign: {include: {campaignRegisters: true}},
                players: {
                    include: {
                        player: {select: {id: true, username: true, email: true}},
                        personalMission: {include: {nodes: true}},
                        nodesPassedOnPairing: true
                    }
                },
                winners: {include: {player: {select: {id: true, username: true, email: true}}}},
            }
        })
        if (!pairing) return res.status(404).json({error: 'No pairing'})
        res.status(200).json(pairing);
    } catch (error) {
        next(error)
    }
})

pairingsRouter.get('/campaign/:campaignId', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const {campaignId} = req.params;
    try {
        const pairing = await dbClient.pairing.findMany({
            where: {campaignId},
            include: {
                mission: true,
                players: {
                    include: {
                        player: {
                            select: {id: true, username: true, email: true}
                        }
                    }
                }
            }
        })
        if (!pairing) return res.status(404).json({error: 'No pairing'})
        res.status(200).json(pairing);
    } catch (error) {
        next(error)
    }
})

pairingsRouter.get('/period/:periodId', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const {periodId} = req.params;
    try {
        const pairing = await dbClient.pairing.findMany({
            where: {periodId},
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
        })
        if (!pairing) return res.status(404).json({error: 'No pairing'})
        res.status(200).json(pairing);
    } catch (error) {
        next(error)
    }
})

pairingsRouter.get('/', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')
    try {
        const {userId: playerId} = jwt.verify(token, process.env.JWT_SECRET)
        const pairing = await dbClient.playersOnPairings.findMany({
            where: {playerId},
            include: {
                pairing: {
                    include: {
                        campaign: {
                            include: {campaignRegisters: {include: {player: true}}}
                        },
                        mission: true,
                        players: {include: {player: {select: {id: true, username: true, email: true}}}}
                    }
                },
                personalMission: true
            }
        })
        if (!pairing) return res.status(404).json({error: 'No pairing'})
        res.status(200).json(pairing);
    } catch (error) {
        next(error)
    }
})

pairingsRouter.put('/:id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const {players, missionId, winners} = req.body;
    try {
        const pairing = await dbClient.pairing.findUnique({where: {id}})
        if (!pairing) return res.status(404).json({error: 'No pairing'})
        const updatedPairing = await dbClient.pairing.update({
            where: {id},
            data: {
                mission: {connect: {id: missionId}},
                players: {
                    deleteMany: {},
                    create: players.map((player: { playerId: string, personalMissionId: string }) => {
                        return player.personalMissionId
                            ? {
                                player: {connect: {id: player.playerId}},
                                personalMission: {connect: {id: player.personalMissionId}}
                            }
                            : {player: {connect: {id: player.playerId}}}
                    })
                },
                winners: {
                    deleteMany: {},
                    create: winners.map((id: string) => {
                        return {player: {connect: {id}}}
                    })
                }
            },
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
        })
        res.status(200).json(updatedPairing);
    } catch (error) {
        next(error)
    }
})

pairingsRouter.delete('/:id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    try {
        dbClient.pairing.delete({where: {id}})
            .then(() => res.sendStatus(204))
    } catch (error) {
        next(error)
    }
})

pairingsRouter.post('/:id/set-winners/', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const winnersIds = req.body.winners as string[]
    const reportLink = req.body.reportLink as string
    try {
        const pairing = await dbClient.pairing.findUnique({
            where: {id},
            include: {
                players: {include: {player: {select: {username: true}}}},
                campaign: {include: {owner: true}}
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
                reportLink,
                resultsApproved: !pairing.campaign.requiresPairingResultsApproval,
                resultsRejected: false,
                rejectMessage: undefined,
                winners: {
                    create: winnersIds.map((id: string) => {
                        return {player: {connect: {id}}}
                    })
                }
            }
        })
        if (pairing.campaign.requiresPairingResultsApproval) {
            await pairingPlayedNotify(pairing)
        }
        res.status(200).json(updatedPairing);
    } catch (error) {
        next(error)
    }
})

pairingsRouter.put('/:id/approve', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    try {
        const pairing = await dbClient.pairing.findUnique({where: {id}})
        if (!pairing) return res.status(404).json({error: 'No pairing'})
        const approvedPairing = await dbClient.pairing.update({
            where: {id},
            data: {
                resultsApproved: true
            },
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
        })
        res.status(200).json(approvedPairing);
    } catch (error) {
        next(error)
    }
})

pairingsRouter.put('/:id/reject', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params
    const {rejectMessage} = req.body
    try {
        const pairing = await dbClient.pairing.findUnique({
            where: {id},
            include: {players: {include: {
                player: {select: {notifications: true, email: true, telegramId: true}}
            }}}
        })
        if (!pairing) return res.status(404).json({error: 'No pairing'})
        const rejectedPairing = await dbClient.pairing.update({
            where: {id},
            data: {
                winners: {deleteMany: {}},
                played: false,
                reportLink: undefined,
                resultsRejected: true,
                rejectMessage
            },
            include: {
                players: {
                    include: {
                        player: {
                            select: {
                                id: true,
                                username: true
                            }
                        },
                        personalMission: true
                    }
                },
                campaign: true,
                mission: {include: {nodes: true}},
                winners: {include: {player: {select: {id: true, username: true, email: true}}}}
            }
        })
        await resultsRejectedNotify(pairing)
        res.status(200).json(rejectedPairing);
    } catch (error) {
        next(error)
    }
})

module.exports = pairingsRouter
