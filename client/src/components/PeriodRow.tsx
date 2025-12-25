import {Button, Flex, Table, TextField} from "@radix-ui/themes";
import {type ChangeEvent, type MouseEventHandler, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import PairingCreateDialog from "./PairingCreateDialog.tsx";
import type {AssetGroup, CampaignAsset, CampaignPeriod, Mission, Pairing, PlayerRegister} from "../types.ts";
import PeriodPairings from "./PeriodPairings.tsx";
import {TriangleDownIcon, TriangleUpIcon} from "@radix-ui/react-icons";

interface Props {
    isOwner: boolean;
    index: number
    onEdit: (period: CampaignPeriod) => void
    onDelete: (id: string) => void
    period: CampaignPeriod
    missions: Mission[]
    campaignPlayers: PlayerRegister[]
    campaignAssets: AssetGroup[]
}

function getAvailableAssetsForPeriod(
    period: CampaignPeriod,
    campaignAssets: AssetGroup[],
): CampaignAsset[] {
    // 1. Собираем все assetId, которые уже задействованы в наградах этого периода
    const usedAssetIds = new Set<string>();

    period.pairing?.forEach(pairing => {
        pairing.rewardsOnPairings.forEach(reward => {
            usedAssetIds.add(reward.assetId);
        });
    });

    const allAssets = campaignAssets.flatMap(group => group.assets);

    return allAssets.filter(asset => !usedAssetIds.has(asset.id));
}

export default function ({isOwner, index, onEdit, onDelete, period, campaignPlayers, missions, campaignAssets}: Props) {
    const [periodChanges, setPeriodChanges] = useState<CampaignPeriod>(period)
    const [edit, setEdit] = useState<boolean>(false)
    const [error, setError] = useState<Error>()

    const pairings = period.pairing
    const availableRewards = getAvailableAssetsForPeriod(period, campaignAssets)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPeriodChanges({
            ...periodChanges,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit: MouseEventHandler<HTMLButtonElement> = () => {
        axios.put<CampaignPeriod>(`campaigns/periods/${period.id}`, periodChanges)
            .then(res => {
                if (res.status === 200) {
                    onEdit(res.data)
                    setEdit(false)
                    setError(undefined)
                }
            }).catch(err => setError(err as Error))
    }

    const handleDelete: MouseEventHandler<HTMLButtonElement> = () => {
        axios.delete(`campaigns/periods/${period.id}`)
            .then(res => {
                if (res.status === 204) {
                    onDelete(period.id)
                    setError(undefined)
                }
            }).catch(err => setError(err as Error))
    }

    const [addPairing, setAddPairing] = useState(false)

    const [unfold, setUnfold] = useState(false)

    return pairings && (
        <>
            <Table.Row>
                <Table.RowHeaderCell
                    onClick={() => {
                        if (pairings.length) setUnfold(!unfold)
                    }}
                    className={pairings.length ? 'cursor-pointer' : ''}
                >
                    <Flex gap="2">
                        Period {index + 1}
                        {pairings.length
                            ? unfold
                                ? <TriangleDownIcon/>
                                : <TriangleUpIcon/>
                            : ''
                        }
                    </Flex>
                </Table.RowHeaderCell>
                <Table.Cell>
                    <Flex align="center" gap="2">
                        {edit
                            ? <TextField.Root
                                type="date"
                                name="dateStart"
                                value={periodChanges.dateStart.slice(0, 10)}
                                onChange={handleChange}
                            />
                            : new Date(period.dateStart).toLocaleDateString()}
                        {' '}-{' '}
                        {edit
                            ? <TextField.Root
                                type="date"
                                name="dateEnd"
                                value={periodChanges.dateEnd.slice(0, 10)}
                                onChange={handleChange}
                            />
                            : new Date(period.dateEnd).toLocaleDateString()}
                    </Flex>
                </Table.Cell>
                {isOwner &&
                  <Table.Cell>
                    <Flex gap="3">
                        {!edit
                            ? <>
                                <Button onClick={() => setEdit(true)}>Edit</Button>
                                <Button onClick={() => setAddPairing(!addPairing)}>
                                    Add pairing
                                </Button>
                                <Button color="red" onClick={handleDelete}>Delete</Button>
                            </>
                            : <>
                                <Button onClick={() => setEdit(false)}>Cancel</Button>
                                <Button color="grass" onClick={handleSubmit}>Submit</Button>
                            </>}
                        {!!error && <ErrorHandler error={error}/>}
                    </Flex>
                  </Table.Cell>}
            </Table.Row>
            {unfold
                ? !!pairings.length &&
              <Table.Row>
                <Table.Cell colSpan={isOwner ? 3 : 2}>
                  <PeriodPairings
                    isOwner={isOwner}
                    pairings={period.pairing as Pairing[]}
                    missions={missions}
                    availableRewards={availableRewards}
                    playerRegisters={campaignPlayers}
                    period={period}
                    onEdit={(pairings) =>
                        onEdit({...period, pairing: pairings})}
                  />
                </Table.Cell>
              </Table.Row>
                : <></>}
            <PairingCreateDialog
                open={addPairing}
                openChange={setAddPairing}
                playerRegisters={campaignPlayers}
                period={period}
                availableRewards={availableRewards}
                onEdit={(pairing) => onEdit({
                    ...period,
                    pairing: [...period.pairing as Pairing[], pairing]
                })}
                missions={missions}
            />
        </>
    )
}