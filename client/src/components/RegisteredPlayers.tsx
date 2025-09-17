import {Button, Card, Container, Flex, Heading, Spinner, Table} from "@radix-ui/themes";
import {useEffect, useState} from "react";
import type {CampaignRegister} from "../../../server/generated/prisma";
import axios from "../axios/axiosConfig.ts";

interface RegData extends CampaignRegister {
    username: string
}

interface Props {
    campaignId: string;
}

export default function ({campaignId}: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [registers, setRegisters] = useState<RegData[]>([])

    useEffect(() => {
        setIsLoading(true)
        axios.get(`/campaigns/register/campaign/${campaignId}`)
            .then(regsRes => {
                if (regsRes.status === 200) setRegisters(regsRes.data)
            }).catch(err => console.log(err))
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
            }).catch(err => console.log(err))
    }

    const handleDelete = (id: string) => {
        axios.delete(`/campaigns/register/${id}`)
            .then(res => {
                if (res.status === 204) setRegisters(registers.filter(reg => reg.id !== id))
            }).catch(err => console.log(err))
    }

    return <Container>
        {isLoading
            ? <Card><Spinner size='3'/></Card>
            : <>
                <Heading mb='2'>Players:</Heading>
                <Card>
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
                                {registers.map((register) => (
                                    <Table.Row key={register.id}>
                                        <Table.Cell>{register.username}</Table.Cell>
                                        <Table.Cell>{register.formationName}</Table.Cell>
                                        <Table.Cell>{register.rosterLink}</Table.Cell>
                                        <Table.Cell>
                                            {register.approved
                                                ? <Button
                                                    color='red'
                                                    onClick={() => handleDelete(register.id)}
                                                >
                                                    Delete
                                                </Button>
                                                : <Flex gap='2' justify='center'>
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
                </Card>
            </>
        }
    </Container>
}