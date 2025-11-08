import type {MissionNode, NodesPassedOnPairing, Pairing} from "../types.ts";
import {Button, Card, Container, Em, Flex, Heading, Separator, Spinner, Text} from "@radix-ui/themes";
import SetPairingResults from "./SetPairingResults.tsx";
import {type MouseEventHandler, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import NextPairingStep from "./NextPairingStep.tsx";
import {useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";
import purifyHTML from "../utils/validators/purifyHTML.ts";

interface Props {
    node: MissionNode
    missionNodes: MissionNode[]
    nodesPassed: NodesPassedOnPairing[]
    onEdit: (nodesPassed: NodesPassedOnPairing[]) => void
    pairing: Pairing
    onPass?: () => void
}

export default function ({node, pairing, onPass, missionNodes, nodesPassed, onEdit}: Props) {
    const auth = useAppSelector(selectAuth);

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()

    const [nextNode, setNextNode] = useState<MissionNode>()
    const [passed, setPassed] = useState(false)

    if (node.nextLinks) for (const nodeLink of node.nextLinks) {
        if (
            nodesPassed
                .map(node => node.nodeId)
                .includes(nodeLink.toId)
        ) {
            if (!nextNode) setNextNode(missionNodes.find(node => node.id === nodeLink.toId))
            if (onPass) onPass()
            break
        }
    }

    const handleChoice = (node: MissionNode) => {
        setIsLoading(true)
        axios.post<NodesPassedOnPairing>(`/missions/nodes/passed/${node.id}`, {pairingId: pairing.id})
            .then(res => {
                if (res.status === 201) {
                    setError(undefined)
                    setNextNode(missionNodes.find(n => n.id === node.id))
                    onEdit([...nodesPassed, res.data])
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
                if (res.status === 204) {
                    setNextNode(undefined)
                    setError(undefined)
                    onEdit(nodesPassed
                        .filter(nodePassed =>
                            nodePassed.nodeId !== nextNode?.id && nodePassed.playerId !== auth.id))
                }
            }).catch(error => setError(error as Error))
            .finally(() => setIsLoading(false))
    }

    return !!error
        ? <Flex justify="center"><ErrorHandler error={error}/></Flex>
        : <>
            <Container width="100vw">
                <Card size="3" m="2">
                    <Flex direction="column" gap="3">
                        <Heading>{node.buttonLabel}</Heading>
                        <Separator size="4"/>
                        <Text><Em>{node.narrativeDescription}</Em></Text>
                        <Separator size="4"/>
                        <Text>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: purifyHTML(node.missionConditions)
                                }}
                                className="ProseMirror"
                            />
                        </Text>
                    </Flex>
                </Card>
            </Container>
            <Separator size="4"/>
            {node.nextLinks && node.nextLinks.length
                ? !!nextNode
                    ? <>
                        {!passed && node.nextLinks.length > 1 &&
                          <Button onClick={handleUndo} disabled={isLoading}>
                              {isLoading
                                  ? <Spinner size="1"/>
                                  : '<< Undo'}
                          </Button>
                        }
                        <NextPairingStep
                            node={nextNode}
                            pairing={pairing}
                            missionNodes={missionNodes}
                            nodesPassed={nodesPassed}
                            onPass={() => setPassed(true)}
                            onEdit={onEdit}
                        />
                    </>
                    : <Flex justify="center" gap="3">
                        {node.nextLinks.map(link => (
                            <Button key={link.id} disabled={isLoading} onClick={() => handleChoice(link.to)}>
                                {isLoading
                                    ? <Spinner size="1"/>
                                    : link.to.buttonLabel}
                            </Button>
                        ))}
                    </Flex>
                : <SetPairingResults pairing={pairing}/>
            }
        </>
}