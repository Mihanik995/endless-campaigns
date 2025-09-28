import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    type Edge,
    type Node,
    type NodeTypes,
    type OnConnect,
    type OnEdgesChange,
    type OnNodesChange,
    ReactFlow,
    ReactFlowProvider
} from '@xyflow/react'
import type {Mission, MissionNode as MNode, NodeLink} from "../types.ts";

import Header from "../components/Header.tsx";
import {Box, Card, Container, Inset, Spinner} from "@radix-ui/themes";
import '@xyflow/react/dist/style.css'
import ErrorHandler from "../components/ErrorHandler.tsx";
import MissionNode from "../components/MissionNode.tsx";
import {useParams} from "react-router";
import {useEffect, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import EntryPointNode from "../components/EntryPointNode.tsx";

export default function () {
    const {id} = useParams();

    const [nodes, setNodes] = useState<Node[]>([])
    const [edges, setEdges] = useState<Edge[]>([])
    const [error, setError] = useState<Error>()
    const [isLoading, setIsLoading] = useState(false)
    const [mission, setMission] = useState<Mission>()
    useEffect(() => {
        setIsLoading(true)
        let uploadedMission: Mission
        const uploadedNodes: Node[] = []
        const uploadedLinks: Edge[] = []
        axios.get(`/missions/${id}`)
            .then(res => {
                if (res.status === 200) {
                    uploadedMission = res.data
                    uploadedNodes.push({
                        id: res.data.id,
                        position: {x: 0, y: 0},
                        data: {},
                        type: 'entryPoint'
                    })
                    if (res.data.startNode) {
                        return axios.get(`/missions/nodes/mission/${id}`)
                    }
                }
            }).then(res => {
            if (res && res.status === 200) {
                uploadedNodes.push(...res.data.nodes.map((node: MNode) => {
                    return {
                        id: node.id,
                        position: {x: node.positionX, y: node.positionY},
                        data: {
                            label: node.label,
                            buttonLabel: node.buttonLabel,
                            description: node.description,
                        },
                        type: 'missionNode'
                    }
                }))
                uploadedLinks.push({
                    id: '0',
                    source: (uploadedNodes.find(node => node.id === id) as Node).id,
                    target: (uploadedNodes.find(node => node.id === uploadedMission.startNode?.id) as Node).id,
                    animated: true
                })
                uploadedLinks.push(...res.data.links.map((link: NodeLink) => {
                    return {
                        id: link.id,
                        source: link.fromId,
                        target: link.toId,
                        animated: true
                    }
                }))
            }
        })
            .catch(error => setError(error as Error))
            .finally(() => {
                setIsLoading(false)
                setMission(uploadedMission)
                setNodes(uploadedNodes)
                setEdges(uploadedLinks)
            })
    }, []);

    const [updateError, setUpdateError] = useState<Error>()
    const onNodesChange: OnNodesChange = (changes) => {
        for (const change of changes) {
            if (change.type === 'position' && !change.dragging) axios.put(`/missions/nodes/${change.id}`, {
                positionX: change.position?.x,
                positionY: change.position?.y,
            }).then(res => {
                if (res.status === 200) setNodes((nodeSnapshot) => applyNodeChanges(changes, nodeSnapshot))
            }).catch(error => setUpdateError(error as Error))
            setNodes((nodeSnapshot) => applyNodeChanges(changes, nodeSnapshot))
        }
    }
    const onEdgesChange: OnEdgesChange = (changes) => {
        setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot))
    }
    const onConnect: OnConnect = (params) => {
        axios.post('/missions/node-links', {
            fromId: params.source,
            toId: params.target,
        }).then(res => {
            if (res.status === 201) {
                setEdges((edgesSnapshot) => addEdge({...params, animated: true}, edgesSnapshot))
            }
        }).catch(error => setUpdateError(error as Error))
    }
    const nodeTypes: NodeTypes = {
        missionNode: MissionNode,
        entryPoint: EntryPointNode
    }

    return (
        <ReactFlowProvider>
            <Header/>
            <Container className='pb-5 pt-23'>
                <Card>
                    {isLoading
                        ? <Spinner size='3'/>
                        : !!error
                            ? <ErrorHandler error={error}/>
                            : !!mission &&
                            <Inset>
                                <Box height='80vh'
                                     width='100vw'
                                     maxWidth='1135px'>
                                    <ReactFlow
                                        nodes={nodes}
                                        nodeTypes={nodeTypes}
                                        edges={edges}
                                        onNodesChange={onNodesChange}
                                        onEdgesChange={onEdgesChange}
                                        onConnect={onConnect}
                                        fitView
                                    >
                                        <Background/>
                                        {updateError && <ErrorHandler error={updateError}/>}
                                    </ReactFlow>
                                </Box>
                            </Inset>
                    }
                </Card>
            </Container>
        </ReactFlowProvider>
    )
}