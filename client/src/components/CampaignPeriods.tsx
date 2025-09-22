import {type ChangeEvent, type MouseEventHandler, useEffect, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import {Button, Card, Container, Flex, Heading, Popover, Spinner, Table} from "@radix-ui/themes";
import ErrorHandler from "./ErrorHandler.tsx";
import TextInput from "./TextInput.tsx";
import PeriodRow from "./PeriodRow.tsx";
import type {CampaignPeriod, CampaignRegister, SimpleMission} from "../types.ts";

interface Props {
    campaignId: string,
    isOwner: boolean,
}

interface RegData {
    id: string,
    playerId: string,
    playerUsername: string
}

export default function ({campaignId, isOwner}: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()
    const [change, setChange] = useState(0)
    const [periods, setPeriods] = useState<CampaignPeriod[]>([])
    const [campaignPlayers, setCampaignPlayers] = useState<RegData[]>([])
    const [missions, setMissions] = useState<SimpleMission[]>([])

    useEffect(() => {
        setIsLoading(true)
        axios.get(`/campaigns/periods/${campaignId}`)
            .then(res => {
                if (res.status === 200) setPeriods(res.data)
            })
            .then(() => axios.get(`/campaigns/register/campaign/${campaignId}`))
            .then(regsRes => {
                if (regsRes.status === 200) setCampaignPlayers(
                    regsRes.data.map((reg: CampaignRegister) => {
                        return {...reg, playerUsername: reg.username}
                    })
                )
            })
            .then(() => axios.get(`/missions/simple`))
            .then(res => {
                if (res.status === 200) setMissions(res.data)
            })
            .catch(error => setError(error as Error))
            .finally(() => setIsLoading(false))
    }, [change]);

    const [newPeriod, setNewPeriod] = useState<CampaignPeriod>({
        id: '',
        campaignId: campaignId,
        dateStart: '',
        dateEnd: ''
    })
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setNewPeriod({
            ...newPeriod,
            [event.target.name]: event.target.value
        })
    }
    const handleSubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        axios.post('/campaigns/periods', newPeriod)
            .then(res => {
                if (res.status === 200) {
                    setPeriods([...periods, {...res.data}])
                    setNewPeriod({id: '', campaignId, dateStart: '', dateEnd: ''})
                }
            }).catch(error => setError(error as Error))
    }

    return <Container mt='3'>
        <Card size='3'>
            {isLoading
                ? <Spinner size='3'/>
                : !!periods.length
                    ? <Table.Root>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell/>
                                <Table.ColumnHeaderCell>
                                    Dates
                                </Table.ColumnHeaderCell>
                                {isOwner &&
                                    <Table.ColumnHeaderCell>
                                        Actions
                                    </Table.ColumnHeaderCell>
                                }
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {periods.sort((a, b) => {
                                const aStart = new Date(a.dateStart) as any
                                const bStart = new Date(b.dateStart) as any
                                return aStart - bStart
                            })
                                .map((period, i) => (
                                    <PeriodRow
                                        key={period.id}
                                        index={i}
                                        isOwner={isOwner}
                                        period={period}
                                        campaignPlayers={campaignPlayers}
                                        missions={missions}
                                        onChange={() => setChange(change + 1)}
                                    />
                                ))}
                            {isOwner &&
                                <Table.Row>
                                    <Table.Cell/>
                                    <Table.Cell/>
                                    <Table.Cell>
                                        <Popover.Root>
                                            <Popover.Trigger>
                                                <Button>Add another period</Button>
                                            </Popover.Trigger>
                                            <Popover.Content>
                                                <Flex direction='column' gap='2'>
                                                    <TextInput
                                                        label='Start Date'
                                                        name='dateStart'
                                                        type='date'
                                                        value={newPeriod.dateStart.slice(0, 10)}
                                                        onChange={handleChange}
                                                    />
                                                    <TextInput
                                                        label='End Date'
                                                        name='dateEnd'
                                                        type='date'
                                                        value={newPeriod.dateEnd.slice(0, 10)}
                                                        onChange={handleChange}
                                                    />
                                                    <Flex gap='2'>
                                                        <Popover.Close>
                                                            <Button>Cancel</Button>
                                                        </Popover.Close>
                                                        <Popover.Close>
                                                            <Button
                                                                color='grass'
                                                                onClick={handleSubmit}
                                                            >
                                                                Submit
                                                            </Button>
                                                        </Popover.Close>
                                                    </Flex>
                                                </Flex>
                                            </Popover.Content>
                                        </Popover.Root>
                                    </Table.Cell>
                                </Table.Row>}
                        </Table.Body>
                    </Table.Root>
                    : <Flex
                        direction='column'
                        align='center'
                        justify='center'
                        gap='3'
                    >
                        <Heading>No periods found</Heading>
                        {isOwner &&
                            <Popover.Root>
                                <Popover.Trigger>
                                    <Button size='3'>Add a period</Button>
                                </Popover.Trigger>
                                <Popover.Content>
                                    <Flex direction='column' gap='2'>
                                        <TextInput
                                            label='Start Date'
                                            name='dateStart'
                                            type='date'
                                            value={newPeriod.dateStart.slice(0, 10)}
                                            onChange={handleChange}
                                        />
                                        <TextInput
                                            label='End Date'
                                            name='dateEnd'
                                            type='date'
                                            value={newPeriod.dateEnd.slice(0, 10)}
                                            onChange={handleChange}
                                        />
                                        <Flex gap='2'>
                                            <Popover.Close>
                                                <Button>Cancel</Button>
                                            </Popover.Close>
                                            <Popover.Close>
                                                <Button
                                                    color='grass'
                                                    onClick={handleSubmit}
                                                >
                                                    Submit
                                                </Button>
                                            </Popover.Close>
                                        </Flex>
                                    </Flex>
                                </Popover.Content>
                            </Popover.Root>
                        }
                    </Flex>
            }
            {!!error && <ErrorHandler error={error}/>}
        </Card>
    </Container>
}