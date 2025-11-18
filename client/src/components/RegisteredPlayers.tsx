import {Button, Card, Container, Flex, Heading, Link, ScrollArea, Spinner, Table} from "@radix-ui/themes";
import {useState} from "react";
import type {Campaign, CampaignRegister} from "../types.ts";
import axios from "../axios/axiosConfig.ts";
import {useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";
import CampaignRegisterForm from "./CampaignRegisterForm.tsx";
import ErrorHandler from "./ErrorHandler.tsx";

interface Props {
    campaign: Campaign;
    isOwner: boolean;
    onEdit: (regs: CampaignRegister[]) => void;
}

export default function ({campaign, isOwner, onEdit}: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()
    const registers = campaign.campaignRegisters as CampaignRegister[]

    const auth = useAppSelector(selectAuth)

    const handleAccept = (id: string) => {
        setIsLoading(true)
        axios.put<CampaignRegister>(`/campaigns/register/${id}`, {approved: true})
            .then(res => {
                if (res.status === 200) {
                    onEdit(registers
                        .map(reg => reg.id === id
                            ? res.data
                            : reg
                        )
                    )
                    setError(undefined)
                }
            }).catch(err => setError(err as Error))
            .finally(() => setIsLoading(false))
    }

    const handleDelete = (id: string) => {
        axios.delete(`/campaigns/register/${id}`)
            .then(res => {
                if (res.status === 204) {
                    onEdit(registers.filter(reg => reg.id !== id))
                    setError(undefined)
                }
            }).catch(err => setError(err as Error))
    }

    return <Container mt='3'>
        <Card size='3'>
            <Flex direction='column' gap='3' align='start'>
                {isLoading
                    ? <Spinner size='3'/>
                    : !!error
                        ? <ErrorHandler error={error}/>
                        : <>
                            {!registers.some(reg => reg.playerId === auth.id) &&
                                <CampaignRegisterForm
                                    campaignId={campaign.id}
                                    onEdit={newReg => onEdit([...registers, newReg])}
                                />
                        }
                        {registers.filter(reg => isOwner ? true : reg.approved).length
                            ? <ScrollArea type='hover' scrollbars='horizontal'>
                                <Table.Root>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.ColumnHeaderCell>Player</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell>Formation
                                                Name</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell>Roster Link</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {registers
                                            .filter(register => isOwner
                                                ? true
                                                : register.approved)
                                            .map((register) => (
                                                <Table.Row key={register.id}>
                                                    <Table.Cell>{register.player?.username}</Table.Cell>
                                                    <Table.Cell>{register.formationName}</Table.Cell>
                                                    <Table.Cell>
                                                        <Link href={register.rosterLink} target='_blank'>
                                                            {register.rosterLink}
                                                        </Link>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {isOwner
                                                            ? register.approved
                                                                ?
                                                                <Button
                                                                    color='red'
                                                                    onClick={() => handleDelete(register.id)}
                                                                >
                                                                    Delete
                                                                </Button>
                                                                : <Flex gap='2'>
                                                                    <Button
                                                                        onClick={() => handleAccept(register.id)}
                                                                    >
                                                                        Accept
                                                                    </Button>
                                                                    <Button
                                                                        color='red'
                                                                        onClick={() => handleDelete(register.id)}
                                                                    >
                                                                        Decline
                                                                    </Button>
                                                                </Flex>
                                                            : (auth.id === register.playerId) &&
                                                            <Button
                                                                color='red'
                                                                onClick={() => handleDelete(register.id)}
                                                            >
                                                                Drop
                                                            </Button>
                                                        }
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}
                                    </Table.Body>
                                </Table.Root>
                            </ScrollArea>
                            : <Container width='100vw'>
                                <Heading align='center' my='9'>
                                    To invite players to your campaign, send them
                                    the campaign link (see above).
                                </Heading>
                            </Container>
                        }
                        </>
                }
            </Flex>
        </Card>
    </Container>
}