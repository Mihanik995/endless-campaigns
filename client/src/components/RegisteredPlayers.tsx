import {Button, Card, Container, Flex, Heading, Link, Spinner, Table} from "@radix-ui/themes";
import {useEffect, useState} from "react";
import type {CampaignRegister} from "../../../server/generated/prisma";
import axios from "../axios/axiosConfig.ts";
import {useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";
import CampaignRegisterForm from "./CampaignRegisterForm.tsx";
import ErrorHandler from "./ErrorHandler.tsx";

interface RegData extends CampaignRegister {
    username: string
}

interface Props {
    campaignId: string;
    isOwner: boolean;
}

export default function ({campaignId, isOwner}: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()
    const [registers, setRegisters] = useState<RegData[]>([])

    const auth = useAppSelector(selectAuth)

    useEffect(() => {
        setIsLoading(true)
        axios.get(`/campaigns/register/campaign/${campaignId}`)
            .then(regsRes => {
                if (regsRes.status === 200) setRegisters(regsRes.data)
            }).catch(err => setError(err as Error))
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    const handleAccept = (id: string) => {
        axios.put(`/campaigns/register/${id}`, {approved: true})
            .then(res => {
                if (res.status === 200) setRegisters(registers
                    .map(reg => reg.id === id
                        ? {...reg, approved: true}
                        : reg
                    )
                )
            }).catch(err => setError(err as Error))
    }

    const handleDelete = (id: string) => {
        axios.delete(`/campaigns/register/${id}`)
            .then(res => {
                if (res.status === 204) setRegisters(registers.filter(reg => reg.id !== id))
            }).catch(err => setError(err as Error))
    }

    return <Container>
        <Card size='3'>
            {isLoading
                ? <Spinner size='3'/>
                : !!error
                    ? <ErrorHandler error={error}/>
                    : <>
                        <Heading mb='2'>Players:</Heading>
                        {registers.length
                            ? <Table.Root>
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
                                                <Table.Cell>{register.username}</Table.Cell>
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
                                                            Drop register
                                                        </Button>
                                                    }
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                </Table.Body>
                            </Table.Root>
                            : <Container width='100vw'>
                                <Heading align='center'>No registrations found.</Heading>
                            </Container>
                        }
                    </>
            }
            {!registers.map(reg => reg.playerId).includes(auth.id as string) &&
                <>
                    <br/>
                    <CampaignRegisterForm campaignId={campaignId}/>
                </>
            }
        </Card>
    </Container>
}