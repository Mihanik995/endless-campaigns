import Header from "../components/Header.tsx";
import {type MouseEventHandler, useEffect, useState} from "react";
import {useParams} from "react-router";
import type {Mission, MissionNode, Pairing, PlayersOnPairings} from "../types.ts";
import axios from "../axios/axiosConfig.ts";
import {useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";
import {Button, Card, Container, Flex, Separator, Spinner} from "@radix-ui/themes";
import ErrorHandler from "../components/ErrorHandler.tsx";
import MissionCard from "../components/MissionCard.tsx";
import SetPairingResults from "../components/SetPairingResults.tsx";
import NextPairingStep from "../components/NextPairingStep.tsx";

export default function () {
    const [error, setError] = useState<Error>()
    const id = useParams().id as string
    const auth = useAppSelector(selectAuth)
    const [pairing, setPairing] = useState<Pairing>({
        id: '', campaignId: '', periodId: '', missionId: '',
        played: false, players: [], winners: [], resultsApproved: false,
        resultsRejected: false, nodesPassedOnPairing: []
    })
    const [mission, setMission] = useState<Mission>()
    const [startNode, setStartNode] = useState<MissionNode>()
    const [nextNode, setNextNode] = useState<MissionNode>()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        axios.get<Pairing>(`/missions/pairings/${id}`)
            .then(res => {
                if (res.status === 200) {
                    if (
                        !res.data.players
                            .map((player: PlayersOnPairings) => player.playerId)
                            .includes(auth.id as string)
                    ) {
                        throw new Error(`You don't participate in that pairing!`)
                    }
                    setPairing(res.data);
                    const mission = res.data.players
                        .find(player => player.playerId === auth.id)?.personalMission || res.data.mission
                    setMission(mission)
                    if (mission?.nodes?.length) {
                        const pairingMissionStartNode = mission.nodes.find(node => node.isMissionStart)
                        setStartNode(pairingMissionStartNode)
                        const passedNodes = res.data.players
                            .find(player => player.playerId === auth.id)?.nodesPassedOnPairing
                        if (passedNodes
                            ?.some(passedNode => passedNode.nodeId === pairingMissionStartNode?.id)) {
                            setNextNode(pairingMissionStartNode);
                        }
                    }

                }
            }).catch(error => setError(error as Error))
            .finally(() => setIsLoading(false))
    }, []);

    const handleStart: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        setIsLoading(true)
        axios.post(`/missions/nodes/passed/${startNode?.id}`, {pairingId: pairing.id})
            .then(res => {
                if (res.status === 201) setNextNode(startNode)
            }).catch(error => setError(error as Error))
            .finally(() => setIsLoading(false))
    }

    return <>
        <Header/>
        <Container className='pb-5 pt-23'>
            <Flex minHeight='40vh' align='center' justify='center'>
                <Card>
                    {isLoading
                        ? <Spinner size='3' m='4'/>
                        : !!error
                            ? <ErrorHandler error={error}/>
                            : <Flex direction='column' align='center' gap='2'>
                                {mission &&
                                    <MissionCard
                                        clickable={false}
                                        onDelete={() => {
                                        }}
                                        mission={mission as Mission}
                                        owner={false}
                                    />
                                }
                                <Separator size='4'/>
                                {startNode
                                    ? !!nextNode
                                        ? <NextPairingStep
                                            node={nextNode}
                                            pairing={pairing}
                                        />
                                        : <Button onClick={handleStart}>
                                            {startNode.buttonLabel}
                                        </Button>
                                    : <SetPairingResults
                                        pairing={pairing}
                                    />
                                }
                            </Flex>
                    }
                </Card>
            </Flex>
        </Container>
    </>
}