import type {MissionNode, Pairing} from "../types.ts";
import {Button, Card, Container, Em, Flex, Heading, Separator, Spinner, Text} from "@radix-ui/themes";
import SetPairingResults from "./SetPairingResults.tsx";
import {type MouseEventHandler, useEffect, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import NextPairingStep from "./NextPairingStep.tsx";
import {useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";

interface Props {
    node: MissionNode
    pairing: Pairing
    onPass?: () => void
}

export default function ({node, pairing, onPass}: Props) {
    const auth = useAppSelector(selectAuth);

    const [nodeData, setNodeData] = useState<MissionNode>()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()

    useEffect(() => {
        setIsLoading(true)
        axios.get<MissionNode>(`/missions/nodes/${node.id}`)
            .then(res => {
                if (res.status === 200) {
                    setNodeData(res.data)
                    for (const nodeLink of res.data.nextLinks) {
                        if (pairing.players
                            .find(player => player.playerId === auth.id)?.nodesPassedOnPairing
                            .map(node => node.nodeId)
                            .includes(nodeLink.toId)) {
                            setNextNode(nodeLink.to)
                            if (onPass) onPass()
                            break
                        }
                    }
                }
            }).catch(error => setError(error as Error))
            .finally(() => setIsLoading(false))
    }, []);

    const [nextNode, setNextNode] = useState<MissionNode>()
    const [passed, setPassed] = useState(false)
    const handleChoice = (node: MissionNode) => {
        setIsLoading(true)
        axios.post(`/missions/nodes/passed/${node.id}`, {pairingId: pairing.id})
            .then(res => {
                if (res.status === 201) {
                    setNextNode(node)
                    if (onPass) onPass()
                }
            }).catch(error => setError(error as Error))
            .finally(() => setIsLoading(false))
    }
    const handleUndo: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        setIsLoading(true)
        axios.post(`/missions/nodes/cancel-pass/${nextNode?.id}`, {pairingId: pairing.id})
            .then(res => {
                if (res.status === 204) setNextNode(undefined)
            }).catch(error => setError(error as Error))
            .finally(() => setIsLoading(false))
    }

    return isLoading
        ? <Flex justify='center'><Spinner size='3'/></Flex>
        : !!error
            ? <Flex justify='center'><ErrorHandler error={error}/></Flex>
            : !!nodeData && <>
            <Container width='100vw'>
                <Card size='3' m='2'>
                    <Flex direction='column' gap='3'>
                        <Heading>{nodeData.buttonLabel}</Heading>
                        <Separator size='4'/>
                        <Text><Em>{nodeData.narrativeDescription}</Em></Text>
                        <Separator size='4'/>
                        <Text>
                            <div
                                dangerouslySetInnerHTML={{__html: nodeData.missionConditions}}
                                className='ProseMirror'
                            />
                        </Text>
                    </Flex>
                </Card>
            </Container>
            <Separator size='4'/>
            {nodeData.nextLinks && nodeData.nextLinks.length
                ? !!nextNode
                    ? <>
                        {!passed && nodeData.nextLinks.length > 1 &&
                            <Button onClick={handleUndo}>
                                {'<< Undo'}
                            </Button>
                        }
                        <NextPairingStep
                            node={nextNode}
                            pairing={pairing}
                            onPass={() => setPassed(true)}
                        />
                    </>
                    : <Flex justify='center' gap='3'>
                        {nodeData.nextLinks.map(link => (
                            <Button key={link.id} onClick={() => handleChoice(link.to)}>
                                {link.to.buttonLabel}
                            </Button>
                        ))}
                    </Flex>
                : <SetPairingResults pairing={pairing}/>
            }
        </>
}