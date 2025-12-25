import {Link, Table, Text} from "@radix-ui/themes";
import {useNavigate} from "react-router";
import type {Pairing} from "../types.ts";
import {Flex} from "@radix-ui/themes";

interface Props {
    pairing: Pairing
}

export default function ({pairing}: Props) {
    const navigate = useNavigate();

    return (
        <Table.Row>
            <Table.Cell>
                <Link
                    href=""
                    onClick={() => navigate(`/missions/${pairing.mission?.id}`)}
                >
                    {pairing.mission?.title}
                </Link>
            </Table.Cell>
            <Table.Cell minWidth="150px">
                <Flex direction="column" gap="1">
                    {pairing.players
                        .map(player => (
                            <Text>
                                {player.player.username}
                            </Text>
                        ))
                    }
                </Flex>
            </Table.Cell>
            <Table.Cell>
                {pairing.rewardsOnPairings.length
                    ? pairing.rewardsOnPairings.map(ROP => <Text>{ROP.asset.title}</Text>)
                    : '-'
                }
            </Table.Cell>
            <Table.Cell>
                {pairing.played
                    ? pairing.winners.length
                        ? pairing.winners.map(winner => winner.player?.username).join(', ')
                        : 'No winners'
                    : 'Not played yet'}
            </Table.Cell>
            <Table.Cell>
                {pairing.reportLink
                    ? <Link href={pairing.reportLink} target="_blank">
                        {pairing.reportLink.length > 20
                            ? `${pairing.reportLink.slice(0, 20)}...`
                            : pairing.reportLink}
                    </Link>
                    : '-'}
            </Table.Cell>
        </Table.Row>
    )
}