import {Button, Card, Container, Flex, Heading, Popover, Spinner, Table, Text} from "@radix-ui/themes";
import {useEffect, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "./ErrorHandler.tsx";

interface CampaignData {
    id: string;
    title: string;
    regulations: string;
    rosterLink: string;
}

interface Props {
    id: string
}

export default function ({id}: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()
    const [campaignsData, setCampaignsData] = useState<CampaignData[]>([])
    useEffect(() => {
        setIsLoading(true)
        axios.get(`/campaigns/register/user/${id}`)
            .then(res => {
                if (res.status === 200) setCampaignsData(res.data)
            }).catch(err => setError(err as Error))
            .finally(() => setIsLoading(false))
    }, []);

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
                                        <Table.ColumnHeaderCell>
                                            Actions
                                        </Table.ColumnHeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {campaignsData.map(reg => (
                                        <Table.Row>
                                            <Table.RowHeaderCell>
                                                {reg.title}
                                            </Table.RowHeaderCell>
                                            <Table.RowHeaderCell>
                                                {reg.regulations}
                                            </Table.RowHeaderCell>
                                            <Table.RowHeaderCell>
                                                {reg.rosterLink}
                                            </Table.RowHeaderCell>
                                            <Table.RowHeaderCell>
                                                <Popover.Root>
                                                    <Popover.Trigger>
                                                        <Button color='red'>
                                                            Delete
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
                                            </Table.RowHeaderCell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Flex>}
            </Container>
        </Card>
    )
}