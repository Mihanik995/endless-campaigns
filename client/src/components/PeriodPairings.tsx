import {Table} from "@radix-ui/themes";
import type {CampaignPeriod, Pairing, PlayerRegister, Mission, CampaignAsset} from "../types.ts";
import OwnerPeriodParingRow from "./OwnerPeriodParingRow.tsx";
import GuestPeriodParingRow from "./GuestPeriodParingRow.tsx";

interface Props {
    isOwner: boolean
    pairings: Pairing[]
    missions: Mission[]
    availableRewards: CampaignAsset[]
    playerRegisters: PlayerRegister[]
    period: CampaignPeriod
    onEdit: (pairings: Pairing[]) => void
}

export default function ({isOwner, pairings, missions, availableRewards, playerRegisters, period, onEdit}: Props) {
    return <Table.Root>
        <Table.Header>
            <Table.Row>
                <Table.ColumnHeaderCell>
                    Mission
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                    Players
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                    Rewards
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                    Winner(s)
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                    Report Link
                </Table.ColumnHeaderCell>
                {isOwner &&
                    <Table.ColumnHeaderCell>
                        Actions
                    </Table.ColumnHeaderCell>}
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {pairings.map((pairing) => isOwner
                ? <OwnerPeriodParingRow
                    key={pairing.id}
                    pairing={pairing}
                    missions={missions}
                    availableRewards={availableRewards}
                    playerRegisters={playerRegisters}
                    period={period}
                    onEdit={(pairing) =>
                        onEdit(pairings.map(p => p.id === pairing.id
                            ? pairing
                            : p))
                    }
                    onDelete={(id) =>
                        onEdit(pairings.filter(pairing => pairing.id !== id))}
                />
                : <GuestPeriodParingRow
                    pairing={pairing}
                />
            )}
        </Table.Body>
    </Table.Root>
}