import {Button, Flex, Popover} from "@radix-ui/themes";
import TextInput from "./TextInput.tsx";
import ErrorHandler from "./ErrorHandler.tsx";
import {useState} from "react";
import type {CampaignPeriod, CampaignPeriodCreate} from "../types.ts";
import axios from "../axios/axiosConfig.ts";
import {type SubmitHandler, useForm} from "react-hook-form";

interface Props {
    campaignId: string
    periods: CampaignPeriod[]
    setPeriods: (periods: CampaignPeriod[]) => void
}

export default function ({campaignId, periods, setPeriods}: Props) {
    const {control, handleSubmit, reset} = useForm<CampaignPeriodCreate>({
        defaultValues: {campaignId},
        mode: "onBlur"
    })

    const [createError, setCreateError] = useState<Error>()
    const onSubmit: SubmitHandler<CampaignPeriodCreate> = (data) => {
        try {
            axios.post('/campaigns/periods', data)
                .then(res => {
                    if (res.status === 200) {
                        setPeriods([...periods, {...res.data}])
                        reset({campaignId, dateStart: '', dateEnd: ''})
                        setCreateError(undefined)
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
                        control={control}
                    />
                    <TextInput
                        label='End Date'
                        name='dateEnd'
                        type='date'
                        control={control}
                    />
                    {!!createError && <ErrorHandler error={createError}/>}
                    <Flex gap='2'>
                        <Popover.Close>
                            <Button>Cancel</Button>
                        </Popover.Close>
                        <Popover.Close>
                            <Button
                                color='grass'
                                onClick={handleSubmit(onSubmit)}
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