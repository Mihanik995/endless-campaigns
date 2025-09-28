import type {MissionNode, Pairing} from "../types.ts";
import {Button, Card, Container, Em, Flex, Heading, Separator, Spinner, Text} from "@radix-ui/themes";
import SetPairingResults from "./SetPairingResults.tsx";
import {type MouseEventHandler, useEffect, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import NextPairingStep from "./NextPairingStep.tsx";

interface Props {
    node: MissionNode
    pairing: Pairing
    onPass?: () => void
}

export default function ({node, pairing, onPass}: Props) {
    const [nodeData, setNodeData] = useState<MissionNode>()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()

    useEffect(() => {
        setIsLoading(true)
        axios.get(`/missions/nodes/${node.id}`)
            .then(res => {
                if (res.status === 200) setNodeData(res.data)
            }).catch(error => setError(error as Error))
            .finally(() => setIsLoading(false))
    }, []);

    const [nextNode, setNextNode] = useState<MissionNode>()
    const [passed, setPassed] = useState(false)
    const handleChoice = (node: MissionNode) => {
        setNextNode(node)
        if (onPass) onPass()
    }
    const handleUndo: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        setNextNode(undefined)
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
                        <Text>{nodeData.missionConditions}</Text>
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