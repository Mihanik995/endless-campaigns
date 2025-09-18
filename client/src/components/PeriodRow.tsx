import {Button, Flex, Table, TextField} from "@radix-ui/themes";
import {type ChangeEvent, type MouseEventHandler, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "./ErrorHandler.tsx";

interface Props {
    isOwner: boolean;
    index: number
    onChange: () => void
    period: {
        id: string;
        campaignId: string;
        dateStart: string;
        dateEnd: string;
    }
}

export default function ({isOwner, index, onChange, period}: Props) {
    const [periodChanges, setPeriodChanges] = useState({...period})
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

    return (
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
    )
}