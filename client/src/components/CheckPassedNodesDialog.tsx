import {Dialog, Flex, ScrollArea, Spinner, Table, Text} from "@radix-ui/themes";
import type {NodesPassedOnPairing, Pairing} from "../types.ts";
import {useEffect, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "./ErrorHandler.tsx";

interface Props {
    open: boolean
    setOpen: (open: boolean) => void
    pairing: Pairing
}

export default function ({open, setOpen, pairing}: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error>()
    const [nodesPassed, setNodesPassed] = useState<NodesPassedOnPairing[]>([])

    useEffect(() => {
        setIsLoading(true)
        axios.get(`/missions/nodes/passed/pairing/${pairing.id}`)
            .then(res => {
                if (res.status === 200) {
                    setNodesPassed(res.data)
                    setError(undefined)
                }
            }).catch(err => setError(err as Error))
            .finally(() => setIsLoading(false))
    }, []);

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Content width='50vw' minWidth='300px'>
                {isLoading
                    ? <Flex justify='center'><Spinner size='3'/></Flex>
                    : !!error
                        ? <Flex justify='center'><ErrorHandler error={error}/></Flex>
                        : <>
                            <Dialog.Title>Nodes players passed</Dialog.Title>
                            <Dialog.Description/>
                            <ScrollArea type='hover' scrollbars='horizontal'>
                                <Table.Root>
                                    <Table.Header>
                                        <Table.Row>
                                            {pairing.players.map(player => (
                                                <Table.ColumnHeaderCell key={player.playerId}>
                                                    {player.player.username}
                                                </Table.ColumnHeaderCell>
                                            ))}
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        <Table.Row>
                                            {pairing.players.map(player => (
                                                <Table.Cell key={player.playerId}>
                                                    <Flex direction='column'>
                                                        {nodesPassed
                                                            .filter(nodePassed => {
                                                                return nodePassed.playerId === player.playerId
                                                            })
                                                            .map(nodePassed => (
                                                                <Text
                                                                    key={`${nodePassed.nodeId}${nodePassed.playerId}`}>
                                                                    {nodePassed.node?.label}
                                                                </Text>
                                                            ))}
                                                    </Flex>
                                                </Table.Cell>
                                            ))}
                                        </Table.Row>
                                    </Table.Body>
                                </Table.Root>
                            </ScrollArea>
                        </>}
            </Dialog.Content>
        </Dialog.Root>
    )
}