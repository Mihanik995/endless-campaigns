import {Button, Flex, Popover, Spinner} from "@radix-ui/themes";
import TextInput from "./TextInput.tsx";
import ErrorHandler from "./ErrorHandler.tsx";
import {useState} from "react";
import type {CampaignPeriod, CampaignPeriodCreate} from "../types.ts";
import axios from "../axios/axiosConfig.ts";
import {type SubmitHandler, useForm} from "react-hook-form";

interface Props {
    campaignId: string
    setNew: (period: CampaignPeriod) => void
}

export default function ({campaignId, setNew}: Props) {
    const {control, handleSubmit, reset} = useForm<CampaignPeriodCreate>({
        defaultValues: {campaignId},
        mode: "onBlur"
    })
    const [isOpen, setIsOpen] = useState(true)

    const [createError, setCreateError] = useState<Error>()
    const [isLoading, setIsLoading] = useState(false)
    const onSubmit: SubmitHandler<CampaignPeriodCreate> = (data) => {
        setIsLoading(true)
        axios.post<CampaignPeriod>('/campaigns/periods', data)
            .then(res => {
                if (res.status === 200) {
                    setNew(res.data)
                    reset({campaignId, dateStart: '', dateEnd: ''})
                    setCreateError(undefined)
                    setIsOpen(false)
                }
            })
            .catch((error) => setCreateError(error as Error))
            .finally(() => setIsLoading(false))
    }

    return (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
            <Popover.Trigger>
                <Button>Add period</Button>
            </Popover.Trigger>
            <Popover.Content>
                <Flex direction="column" gap="2">
                    <TextInput
                        label="Start Date"
                        name="dateStart"
                        type="date"
                        control={control}
                    />
                    <TextInput
                        label="End Date"
                        name="dateEnd"
                        type="date"
                        control={control}
                    />
                    {!!createError && <ErrorHandler error={createError}/>}
                    <Flex gap="2">
                        <Popover.Close>
                            <Button disabled={isLoading}>Cancel</Button>
                        </Popover.Close>
                        <Popover.Close>
                            <Button
                                color="grass"
                                onClick={handleSubmit(onSubmit)}
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? <Spinner size="1"/>
                                    : 'Submit'
                                }
                            </Button>
                        </Popover.Close>
                    </Flex>
                </Flex>
            </Popover.Content>
        </Popover.Root>
    )
}