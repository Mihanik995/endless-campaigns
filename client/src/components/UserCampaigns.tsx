import {Button, Card, Container, Flex, Heading, Link, Popover, Spinner, Table, Text} from "@radix-ui/themes";
import {useEffect, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import {useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";
import {useNavigate} from "react-router";
import type {CampaignRegister} from "../types.ts";

interface Props {
    id: string
}

export default function ({id}: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()
    const [campaignsData, setCampaignsData] = useState<CampaignRegister[]>([])
    useEffect(() => {
        setIsLoading(true)
        axios.get<CampaignRegister[]>(`/campaigns/register/user/${id}`)
            .then(res => {
                if (res.status === 200) {
                    setCampaignsData(res.data)
                    setError(undefined)
                }
            }).catch(err => setError(err as Error))
            .finally(() => setIsLoading(false))
    }, []);

    const auth = useAppSelector(selectAuth)
    const isOwner = auth.id === id
    const navigate = useNavigate()

    const handleDelete = (id: string) => {
        axios.delete(`/campaigns/register/${id}`)
            .then(res => {
                if (res.status === 204) setCampaignsData(campaignsData.filter(reg => reg.id !== id))
            }).catch(err => setError(err as Error))
    }

    return (
        <Card size='3'>
            <Container width='100vw'>
                {isLoading
                    ? <Flex height='200px' justify='center' align='center'>
                        <Spinner/>
                    </Flex>
                    : !!error
                        ? <Flex height='200px' justify='center' align='center'>
                            <ErrorHandler error={error}/>
                        </Flex>
                        : <Flex direction='column' px='5' gap='3'>
                            <Heading>Campaigns</Heading>
                            <Table.Root>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeaderCell>
                                            Title
                                        </Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>
                                            Regulations
                                        </Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>
                                            Your Roster
                                        </Table.ColumnHeaderCell>
                                        {isOwner && <Table.ColumnHeaderCell>
                                            Actions
                                        </Table.ColumnHeaderCell>}
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {campaignsData.map(reg => (
                                        <Table.Row key={reg.id}>
                                            <Table.RowHeaderCell>
                                                <Link href=''
                                                      onClick={() => navigate(`/campaigns/${reg.campaign.id}`)}
                                                >
                                                    {reg.campaign.title}
                                                </Link>
                                            </Table.RowHeaderCell>
                                            <Table.RowHeaderCell>
                                                <Link href={reg.campaign.regulations} target='_blank'>
                                                    {reg.campaign.regulations}
                                                </Link>
                                            </Table.RowHeaderCell>
                                            <Table.RowHeaderCell>
                                                <Link href={reg.rosterLink} target='_blank'>
                                                    {reg.rosterLink}
                                                </Link>
                                            </Table.RowHeaderCell>
                                            {isOwner && <Table.RowHeaderCell>
                                                <Popover.Root>
                                                    <Popover.Trigger>
                                                        <Button color='red'>
                                                            Drop
                                                        </Button>
                                                    </Popover.Trigger>
                                                    <Popover.Content>
                                                        <Flex direction='column' gap='2'>
                                                            <Heading>Are you sure?</Heading>
                                                            <Text>
                                                                This action will drop any of your progress
                                                                in this campaign, it cannot be restored!
                                                            </Text>
                                                            <Flex gap='2'>
                                                                <Popover.Close>
                                                                    <Button>
                                                                        Cancel
                                                                    </Button>
                                                                </Popover.Close>
                                                                <Popover.Close>
                                                                    <Button
                                                                        color='red'
                                                                        onClick={() => handleDelete(reg.id)}
                                                                    >
                                                                        Delete
                                                                    </Button>
                                                                </Popover.Close>
                                                            </Flex>
                                                        </Flex>
                                                    </Popover.Content>
                                                </Popover.Root>
                                            </Table.RowHeaderCell>}
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Flex>}
            </Container>
        </Card>
    )
}