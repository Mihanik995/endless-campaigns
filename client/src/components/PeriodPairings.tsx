import {Table} from "@radix-ui/themes";
import type {CampaignPeriod, Pairing, PlayerRegister, SimpleMission} from "../types.ts";
import PeriodParingRow from "./PeriodParingRow.tsx";

interface Props {
    isOwner: boolean
    pairings: Pairing[]
    missions: SimpleMission[]
    playerRegisters: PlayerRegister[]
    period: CampaignPeriod
    onChange: () => void
}

export default function ({isOwner, pairings, missions, playerRegisters, period, onChange}: Props) {
    return <Table.Root>
        <Table.Header>
            <Table.Row>
                <Table.ColumnHeaderCell>
                    Mission
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                    Players
                </Table.ColumnHeaderCell>
                {isOwner &&
                    <Table.ColumnHeaderCell>
                        Actions
                    </Table.ColumnHeaderCell>}
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {pairings.map((pairing) => (
                <PeriodParingRow
                    key={pairing.id}
                    pairing={pairing}
                    isOwner={isOwner}
                    missions={missions}
                    playerRegisters={playerRegisters}
                    period={period}
                    onChange={onChange}
                />
            ))}
        </Table.Body>
    </Table.Root>
}