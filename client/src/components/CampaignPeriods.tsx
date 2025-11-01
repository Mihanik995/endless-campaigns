import {Card, Container, Flex, Heading, Table} from "@radix-ui/themes";
import PeriodRow from "./PeriodRow.tsx";
import type {Campaign, CampaignPeriod, Mission, PlayerRegister} from "../types.ts";
import CreatePeriodButton from "./CreatePeriodButton.tsx";

interface Props {
    campaign: Campaign
    missions: Mission[]
    isOwner: boolean
    onEdit: (periods: CampaignPeriod[]) => void
}

export default function ({campaign, isOwner, missions, onEdit}: Props) {
    const periods: CampaignPeriod[] = campaign.campaignPeriod || []
    const campaignPlayers: PlayerRegister[] = campaign.campaignRegisters
        ?.map(reg => {
            return {...reg, playerUsername: reg.player?.username}
        }) as PlayerRegister[]

    return <Container mt="3">
        <Card size="3">
            {!!periods.length
                ? <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell minWidth="100px"/>
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
                                    onEdit={(period) =>
                                        onEdit(periods?.map(p => p.id === period.id
                                            ? period
                                            : p))
                                    }
                                    onDelete={(id) =>
                                        onEdit(periods?.filter(period =>
                                            period.id !== id))
                                    }
                                />
                            ))}
                        {isOwner &&
                            <Table.Row>
                                <Table.Cell/>
                                <Table.Cell/>
                                <Table.Cell>
                                    <CreatePeriodButton
                                        campaignId={campaign.id}
                                        setNew={(newPeriod) =>
                                            onEdit([...periods, newPeriod])
                                        }
                                    />
                                </Table.Cell>
                            </Table.Row>
                        }
                    </Table.Body>
                </Table.Root>
                : <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    gap="3"
                >
                    <Heading>No periods found</Heading>
                    {isOwner &&
                        <CreatePeriodButton
                            campaignId={campaign.id}
                            setNew={(newPeriod) =>
                                onEdit([...periods, newPeriod])
                            }
                        />
                    }
                </Flex>
            }
        </Card>
    </Container>
}