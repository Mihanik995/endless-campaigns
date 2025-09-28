import type {Request, Response} from 'express'
import type {Mission} from "../../../generated/prisma";

const {Router} = require('express')
const {PrismaClient} = require('../../../generated/prisma')
const {verifyToken} = require('../../auth/middleware')


const nodesRouter = Router()
const dbClient = new PrismaClient()

async function collectReachableGraphFromPrisma(
    startId: string
): Promise<{ nodeIds: Set<string>; linkIds: Set<string> }> {
    const visitedNodeIds = new Set<string>();
    const visitedLinkIds = new Set<string>();
    const queue = [startId];

    while (queue.length > 0) {
        const currentId = queue.pop();
        if (!currentId || visitedNodeIds.has(currentId)) continue;

        visitedNodeIds.add(currentId);

        const currentNode = await dbClient.missionNode.findUnique({
            where: {id: currentId},
            include: {nextLinks: true},
        });

        if (!currentNode) continue;

        for (const link of currentNode.nextLinks) {
            if (!visitedLinkIds.has(link.id)) {
                visitedLinkIds.add(link.id);
                queue.push(link.toId);
            }
        }
    }

    return {nodeIds: visitedNodeIds, linkIds: visitedLinkIds};
}

nodesRouter.post('/', verifyToken, async (req: Request, res: Response) => {
    const data = req.body
    try {
        const node = await dbClient.missionNode.create({data})
        res.status(201).send(node)
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
})

nodesRouter.get('/:id', verifyToken, async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        const node = await dbClient.missionNode.findUnique({
            where: {id},
            include: {nextLinks: {include: {to: true}}}
        })
        if (!node) return res.status(404).send('Node not found')
        res.status(200).send(node)
    } catch (error) {
        res.status(500).json({error})
    }
})

nodesRouter.get('/mission/:id', verifyToken, async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        const mission = await dbClient.mission.findUnique({
            where: {id},
            include: {startNode: true}
        }) as Mission
        if (!mission) return res.status(404).send('Mission not found')
        if (!mission.startNode) return res.status(400).send('Mission has no start node')
        const {nodeIds, linkIds} = await collectReachableGraphFromPrisma(mission.startNode.id)
        const nodes = await dbClient.missionNode.findMany({
            where: { id: { in: Array.from(nodeIds) } },
        });
        const links = await dbClient.nodeLink.findMany({
            where: { id: { in: Array.from(linkIds) } },
        });
        res.status(200).json({nodes, links})
    } catch (error) {
        res.status(500).json({error})
    }
})

nodesRouter.put('/:id', verifyToken, async (req: Request, res: Response) => {
    const id = req.params.id
    const data = req.body
    try {
        const node = await dbClient.missionNode.findUnique({where: {id}})
        if (!node) return res.status(404).send('Node not found')
        const updatedNode = await dbClient.missionNode.update({where: {id}, data})
        res.status(200).send(updatedNode)
    } catch (error) {
        res.status(500).json({error})
    }
})

nodesRouter.delete('/:id', (req: Request, res: Response) => {
    const id = req.params.id
    try {
        dbClient.missionNode.delete({where: {id}})
            .then(() => res.sendStatus(204))
    } catch (error) {
        res.status(500).json({error})
    }
})

module.exports = nodesRouter