import {useEffect, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import {Card, Container, Flex, Heading, Spinner, Table} from "@radix-ui/themes";
import ErrorHandler from "./ErrorHandler.tsx";
import PeriodRow from "./PeriodRow.tsx";
import type {CampaignPeriod, CampaignRegister, PlayerRegister, Mission} from "../types.ts";
import CreatePeriodButton from "./CreatePeriodButton.tsx";

interface Props {
    campaignId: string,
    isOwner: boolean,
}

export default function ({campaignId, isOwner}: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()
    const [change, setChange] = useState(0)
    const [periods, setPeriods] = useState<CampaignPeriod[]>([])
    const [campaignPlayers, setCampaignPlayers] = useState<PlayerRegister[]>([])
    const [missions, setMissions] = useState<Mission[]>([])

    useEffect(() => {
        setIsLoading(true)
        axios.get(`/campaigns/periods/${campaignId}`)
            .then(res => {
                if (res.status === 200) setPeriods(res.data)
            })
            .then(() => axios.get(`/campaigns/register/campaign/${campaignId}`))
            .then(regsRes => {
                if (regsRes.status === 200) setCampaignPlayers(
                    regsRes.data.filter((reg: CampaignRegister) => reg.approved)
                        .map((reg: CampaignRegister) => {
                            return {...reg, playerUsername: reg.player?.username}
                        })
                )
            })
            .then(() => axios.get(`/missions`))
            .then(res => {
                if (res.status === 200) setMissions(res.data)
            })
            .catch(error => setError(error as Error))
            .finally(() => setIsLoading(false))
    }, [change]);

    return <Container mt='3'>
        <Card size='3'>
            {isLoading
                ? <Spinner size='3'/>
                : !!periods.length
                    ? <Table.Root>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell minWidth='100px'/>
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
                                        <CreatePeriodButton
                                            campaignId={campaignId}
                                            periods={periods}
                                            setPeriods={setPeriods}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                            }
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
                            <CreatePeriodButton
                                campaignId={campaignId}
                                periods={periods}
                                setPeriods={setPeriods}
                            />
                        }
                    </Flex>
            }
            {
                !!error && <ErrorHandler error={error}/>
            }
        </Card>
    </Container>
}