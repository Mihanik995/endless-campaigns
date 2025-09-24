import {Button, Flex, Popover} from "@radix-ui/themes";
import TextInput from "./TextInput.tsx";
import ErrorHandler from "./ErrorHandler.tsx";
import {type ChangeEvent, type MouseEventHandler, useState} from "react";
import type {CampaignPeriod, CampaignPeriodCreate} from "../types.ts";
import validateData from "../utils/validators/validateData.ts";
import axios from "../axios/axiosConfig.ts";

interface Props {
    campaignId: string
    periods: CampaignPeriod[]
    setPeriods: (periods: CampaignPeriod[]) => void
}

export default function ({campaignId, periods, setPeriods}: Props) {
    const [newPeriod, setNewPeriod] = useState<CampaignPeriodCreate>({
        campaignId: campaignId,
        dateStart: '',
        dateEnd: ''
    })

    const [createError, setCreateError] = useState<Error>()
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setNewPeriod({
            ...newPeriod,
            [event.target.name]: event.target.value
        })
    }
    const handleSubmit: MouseEventHandler<HTMLButtonElement> = () => {
        try {
            validateData<CampaignPeriodCreate>(newPeriod)
            axios.post('/campaigns/periods', newPeriod)
                .then(res => {
                    if (res.status === 200) {
                        setPeriods([...periods, {...res.data}])
                        setNewPeriod({id: '', campaignId, dateStart: '', dateEnd: ''})
                    }
                })
        } catch (error) {
            setCreateError(error as Error)
        }
    }

    return (
        <Popover.Root>
            <Popover.Trigger>
                <Button>Add period</Button>
            </Popover.Trigger>
            <Popover.Content>
                <Flex direction='column' gap='2'>
                    <TextInput
                        label='Start Date'
                        name='dateStart'
                        type='date'
                        value={newPeriod.dateStart.slice(0, 10)}
                        onChange={handleChange}
                    />
                    <TextInput
                        label='End Date'
                        name='dateEnd'
                        type='date'
                        value={newPeriod.dateEnd.slice(0, 10)}
                        onChange={handleChange}
                    />
                    {!!createError && <ErrorHandler error={createError}/>}
                    <Flex gap='2'>
                        <Popover.Close>
                            <Button>Cancel</Button>
                        </Popover.Close>
                        <Popover.Close>
                            <Button
                                color='grass'
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                        </Popover.Close>
                    </Flex>
                </Flex>
            </Popover.Content>
        </Popover.Root>
    )
}