import {Button, Card, Container, DataList, Flex, Link, Separator, Text} from "@radix-ui/themes";
import {useNavigate} from "react-router";
import type {CampaignRegister, Pairing} from "../types.ts";

interface Props {
    pairing: Pairing
}

export default function ({pairing}: Props) {
    const navigate = useNavigate()

    const campaignRegisters = pairing.campaign?.campaignRegisters as CampaignRegister[];
    const pairingPlayersIds = pairing.players.map(player => player.playerId)
    const pairingPlayersRegs = campaignRegisters
        .filter(reg => pairingPlayersIds.includes(reg.playerId))

    return (
        <Container width='100vw'>
            <Card size='3' m='2'>
                <Flex gap='3'>
                    <Flex
                        width='100%'
                        direction='column'
                        align='start'
                    >
                        <Text>
                            <Flex gap='2'>
                                Mission:
                                <Link
                                    href=''
                                    onClick={() => navigate(`/missions/${pairing.simpleMission?.id}`)}
                                >
                                    {pairing.simpleMission?.title}
                                </Link>
                            </Flex>
                        </Text>
                        <Separator size='4' my='2'/>
                        <Text>
                            <Flex gap='2' direction='column'>
                                Players:
                                <DataList.Root>
                                    {pairingPlayersRegs.map(player => (
                                        <DataList.Item key={player.id}>
                                            <DataList.Label>
                                                {player.player?.username}
                                            </DataList.Label>
                                            <DataList.Value>
                                                {player.formationName} (
                                                <Link href={player.rosterLink}>
                                                    {player.rosterLink}
                                                </Link>
                                                )
                                            </DataList.Value>
                                        </DataList.Item>
                                    ))}
                                </DataList.Root>
                            </Flex>
                        </Text>
                        <Separator size='4' my='2'/>
                        <Button onClick={() => navigate(`/pairings/${pairing.id}/`)}>
                            Play the mission
                        </Button>
                    </Flex>
                </Flex>
            </Card>
        </Container>
    )
}