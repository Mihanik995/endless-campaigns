import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    Controls,
    type Edge,
    type EdgeTypes,
    type Node,
    type NodeTypes,
    type OnConnect,
    type OnEdgesChange,
    type OnNodesChange,
    ReactFlow,
    ReactFlowProvider
} from '@xyflow/react'
import type {Mission} from "../types.ts";

import Header from "../components/Header.tsx";
import {Box, Card, Container, Inset, Spinner} from "@radix-ui/themes";
import '@xyflow/react/dist/style.css'
import ErrorHandler from "../components/ErrorHandler.tsx";
import MissionNode from "../components/MissionNode.tsx";
import {useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import EntryPointNode from "../components/EntryPointNode.tsx";
import {useAppSelector} from "../app/hooks.ts";
import {selectTheme} from "../app/features/theme/themeSlice.ts";
import CustomEdge from "../components/CustomEdge.tsx";
import {selectAuth} from "../app/features/auth/authSlice.ts";

export default function () {
    const theme = useAppSelector(selectTheme).theme as 'light' | 'dark'
    const id = useParams().id as string
    const auth = useAppSelector(selectAuth)
    const navigate = useNavigate()

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
        axios.get<Mission>(`/missions/${id}`)
            .then(res => {
                if (res.status === 200) {
                    if (res.data.creatorId !== auth.id) navigate(`/missions/${id}`)
                    uploadedMission = res.data

                    uploadedNodes.push({
                        id: uploadedMission.id,
                        position: {x: 0, y: 0},
                        data: {missionId: res.data.id},
                        type: 'entryPoint'
                    })
                    for (const missionNode of res.data.nodes) {
                        uploadedNodes.push({
                            id: missionNode.id,
                            position: {
                                x: missionNode.positionX,
                                y: missionNode.positionY},
                            data: {
                                label: missionNode.label,
                                buttonLabel: missionNode.buttonLabel,
                                narrativeDescription: missionNode.narrativeDescription,
                                missionConditions: missionNode.missionConditions,
                                missionId: res.data.id},
                            type: 'missionNode'
                        })
                        if (missionNode.isMissionStart) uploadedLinks.push({
                            id: '0',
                            source: uploadedMission.id,
                            target: missionNode.id,
                            animated: true,
                        })
                        for (const conn of missionNode.nextLinks) {
                            if (!uploadedLinks.some(link => link.id === conn.id)){
                                uploadedLinks.push({
                                    id: conn.id,
                                    source: conn.fromId,
                                    target: conn.toId,
                                    animated: true,
                                    type: 'customEdge'
                                })
                            }
                        }
                    }
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
    const edgeTypes: EdgeTypes = {
        customEdge: CustomEdge
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
                                        edgeTypes={edgeTypes}
                                        onNodesChange={onNodesChange}
                                        onEdgesChange={onEdgesChange}
                                        onConnect={onConnect}
                                        colorMode={theme}
                                        fitView
                                    >
                                        <Background/>
                                        <Controls/>
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