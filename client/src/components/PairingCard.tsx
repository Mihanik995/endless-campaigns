import {Button, Card, Container, DataList, Flex, Link, Separator, Text} from "@radix-ui/themes";
import {useNavigate} from "react-router";
import type {CampaignRegister, Mission, Pairing} from "../types.ts";

interface Props {
    pairing: Pairing
    personalMission?: Mission
}

export default function ({pairing, personalMission}: Props) {
    const navigate = useNavigate()

    const mission = personalMission || pairing.mission
    const campaignRegisters = pairing.campaign?.campaignRegisters as CampaignRegister[];
    const pairingPlayersIds = pairing.players.map(player => player.playerId)
    const pairingPlayersRegs = campaignRegisters
        .filter(reg => pairingPlayersIds.includes(reg.playerId))

    return (
        <Container width="100vw">
            <Card size="3" m="2">
                <Flex gap="3">
                    <Flex
                        width="100%"
                        direction="column"
                        align="start"
                    >
                        <Text>
                            <Flex gap="2">
                                Mission:
                                <Link
                                    href=""
                                    onClick={() => navigate(`/missions/${mission?.id}`)}
                                >
                                    {mission?.title}
                                </Link>
                            </Flex>
                        </Text>
                        <Separator size="4" my="2"/>
                        <Text>
                            <Flex gap="2" direction="column">
                                Players:
                                <DataList.Root orientation={{
                                    initial: 'vertical',
                                    xs: 'horizontal'
                                }}>
                                    {pairingPlayersRegs.map(player => (
                                        <DataList.Item key={player.id}>
                                            <DataList.Label>
                                                {player.player?.username}
                                            </DataList.Label>
                                            <DataList.Value>
                                                <Text>
                                                    {player.formationName} (
                                                    <Link href={player.rosterLink}>
                                                        {player.rosterLink}
                                                    </Link>
                                                    )
                                                </Text>
                                            </DataList.Value>
                                        </DataList.Item>
                                    ))}
                                </DataList.Root>
                            </Flex>
                        </Text>
                        <Separator size="4" my="2"/>
                        {pairing.rewardsOnPairings.length > 0 && <>
                            {pairing.rewardsOnPairings.length > 1
                                ? <Flex direction="column" gap="2">
                                    <Text>Rewards:</Text>
                                    <DataList.Root orientation={{
                                        initial: 'vertical',
                                        sm: 'horizontal'
                                    }}>
                                    {pairing.rewardsOnPairings.map(reward =>
                                        <DataList.Label>- {reward.asset.title}</DataList.Label>)}
                                    </DataList.Root>
                                </Flex>
                                : <Text>Reward: {pairing.rewardsOnPairings[0].asset.title}</Text>
                              }
                          <Separator size="4" my="2"/>
                        </>}
                        {pairing.played
                            ? <Button
                                onClick={() => navigate(`/pairings/${pairing.id}/`)}
                                color="grass"
                            >
                                Show results
                            </Button>
                            : <Button onClick={() => navigate(`/pairings/${pairing.id}/`)}>
                                Play the mission
                            </Button>
                        }
                    </Flex>
                </Flex>
            </Card>
        </Container>
    )
}