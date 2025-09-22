import {Button, Flex, Table, TextField} from "@radix-ui/themes";
import {type ChangeEvent, type MouseEventHandler, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import PairingCreateRow from "./PairingCreateRow.tsx";
import type {CampaignPeriod, SimpleMission} from "../types.ts";

interface Props {
    isOwner: boolean;
    index: number
    onChange: () => void
    period: CampaignPeriod
    missions: SimpleMission[]
    campaignPlayers: {
        id: string;
        playerId: string;
        username: string;
    }[]
}

export default function ({isOwner, index, onChange, period, campaignPlayers, missions}: Props) {
    const [periodChanges, setPeriodChanges] = useState<CampaignPeriod>(period)
    const [edit, setEdit] = useState<boolean>(false)
    const [error, setError] = useState<Error>()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPeriodChanges({
            ...periodChanges,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        axios.put(`campaigns/periods/${period.id}`, periodChanges)
            .then(res => {
                if (res.status === 200) onChange()
            }).catch(err => setError(err as Error))
    }

    const handleDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        axios.delete(`campaigns/periods/${period.id}`)
            .then(res => {
                if (res.status === 204) onChange()
            }).catch(err => setError(err as Error))
    }

    const [addPairing, setAddPairing] = useState(false)

    return (
        <>
            <Table.Row>
                <Table.RowHeaderCell>
                    Period {index + 1}
                </Table.RowHeaderCell>
                <Table.Cell>
                    <Flex align='center'>
                        {edit
                            ? <TextField.Root
                                type='date'
                                name='dateStart'
                                value={periodChanges.dateStart}
                                onChange={handleChange}
                            />
                            : new Date(period.dateStart).toLocaleDateString()}
                        {' - '}
                        {edit
                            ? <TextField.Root
                                type='date'
                                name='dateEnd'
                                value={periodChanges.dateEnd}
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
                                        {addPairing ? 'Cancel' : 'Add pairing'}
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
                <PairingCreateRow
                    players={campaignPlayers}
                    period={period}
                    onChange={onChange}
                    missions={missions}
                />
            }
        </>
    )
}