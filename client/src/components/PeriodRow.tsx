import {Button, Flex, Spinner, Table, TextField} from "@radix-ui/themes";
import {type ChangeEvent, type MouseEventHandler, useEffect, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import PairingCreateDialog from "./PairingCreateDialog.tsx";
import type {CampaignPeriod, Pairing, PlayerRegister, Mission} from "../types.ts";
import PeriodPairings from "./PeriodPairings.tsx";
import {TriangleDownIcon, TriangleUpIcon} from "@radix-ui/react-icons";

interface Props {
    isOwner: boolean;
    index: number
    onChange: () => void
    period: CampaignPeriod
    missions: Mission[]
    campaignPlayers: PlayerRegister[]
}

export default function ({isOwner, index, onChange, period, campaignPlayers, missions}: Props) {
    const [periodChanges, setPeriodChanges] = useState<CampaignPeriod>(period)
    const [edit, setEdit] = useState<boolean>(false)
    const [error, setError] = useState<Error>()

    const [isLoading, setIsLoading] = useState(false)
    const [pairingsError, setPairingsEError] = useState<Error>()
    const [pairings, setPairings] = useState<Pairing[]>([])
    useEffect(() => {
        setIsLoading(true)

        axios.get(`/missions/pairings/period/${period.id}`)
            .then(res => {
                if (res.status === 200) setPairings(res.data)
            }).catch(err => setPairingsEError(err as Error))
            .finally(() => setIsLoading(false))
    }, [])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPeriodChanges({
            ...periodChanges,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit: MouseEventHandler<HTMLButtonElement> = () => {
        axios.put(`campaigns/periods/${period.id}`, periodChanges)
            .then(res => {
                if (res.status === 200) onChange()
            }).catch(err => setError(err as Error))
    }

    const handleDelete: MouseEventHandler<HTMLButtonElement> = () => {
        axios.delete(`campaigns/periods/${period.id}`)
            .then(res => {
                if (res.status === 204) onChange()
            }).catch(err => setError(err as Error))
    }

    const [addPairing, setAddPairing] = useState(false)

    const [unfold, setUnfold] = useState(false)

    return (
        <>
            <Table.Row>
                <Table.RowHeaderCell
                    onClick={() => {
                        if (pairings.length) setUnfold(!unfold)
                    }}
                    className={pairings.length ? 'cursor-pointer' : ''}
                >
                    <Flex gap='2'>
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
                    <Flex align='center' gap='2'>
                        {edit
                            ? <TextField.Root
                                type='date'
                                name='dateStart'
                                value={periodChanges.dateStart.slice(0,10)}
                                onChange={handleChange}
                            />
                            : new Date(period.dateStart).toLocaleDateString()}
                        -
                        {edit
                            ? <TextField.Root
                                type='date'
                                name='dateEnd'
                                value={periodChanges.dateEnd.slice(0,10)}
                                onChange={handleChange}
                            />
                            : new Date(period.dateEnd).toLocaleDateString()}
                    </Flex>
                </Table.Cell>
                {isOwner &&
                    <Table.Cell>
                        <Flex gap='3'>
                            {!edit
                                ? <>
                                    <Button onClick={() => setEdit(true)}>Edit</Button>
                                    <Button onClick={() => setAddPairing(!addPairing)}>
                                        Add pairing
                                    </Button>
                                    <Button color='red' onClick={handleDelete}>Delete</Button>
                                </>
                                : <>
                                    <Button onClick={() => setEdit(false)}>Cancel</Button>
                                    <Button color='grass' onClick={handleSubmit}>Submit</Button>
                                </>}
                            {!!error && <ErrorHandler error={error}/>}
                        </Flex>
                    </Table.Cell>}
            </Table.Row>
            {addPairing &&
                <PairingCreateDialog
                    open={addPairing}
                    openChange={(open) => setAddPairing(open)}
                    playerRegisters={campaignPlayers}
                    period={period}
                    onChange={onChange}
                    missions={missions}
                />
            }
            {unfold
                ? isLoading
                    ? <Table.Row>
                        <Table.Cell colSpan={isOwner ? 3 : 2} justify='center'>
                            <Spinner size='3'/>
                        </Table.Cell>
                    </Table.Row>
                    : !!pairingsError
                        ? <Table.Row>
                            <Table.Cell colSpan={isOwner ? 3 : 2} justify='center'>
                                <ErrorHandler error={pairingsError}/>
                            </Table.Cell>
                        </Table.Row>
                        : !!pairings.length &&
                        <Table.Row>
                            <Table.Cell colSpan={isOwner ? 3 : 2}>
                                <PeriodPairings
                                    isOwner={isOwner}
                                    pairings={pairings}
                                    missions={missions}
                                    playerRegisters={campaignPlayers}
                                    period={period}
                                    onChange={onChange}
                                />
                            </Table.Cell>
                        </Table.Row>
                : <></>}
        </>
    )
}