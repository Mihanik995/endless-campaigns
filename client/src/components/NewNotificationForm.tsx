import {Button, Flex, Popover, Spinner, Text} from "@radix-ui/themes";
import TextInput from "./TextInput.tsx";
import {useState} from "react";
import type {CustomNotification, CustomNotificationCreate} from "../types.ts";
import TextAreaInput from "./TextAreaInput.tsx";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import {type SubmitHandler, useForm} from "react-hook-form";

interface Props {
    campaignId: string;
    setNew: (notification: CustomNotification) => void
}

export default function ({campaignId, setNew}: Props) {
    const {control, handleSubmit} = useForm<CustomNotificationCreate>({
        defaultValues: {campaignId},
        mode: "onBlur"
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()

    const onSubmit: SubmitHandler<CustomNotificationCreate> = (data) => {
        setIsLoading(true)
        axios.post<CustomNotification>('/campaigns/notifications', data)
            .then((res) => {
                if (res.status === 201) {
                    setNew(res.data)
                    setError(undefined)
                }
            }).catch((err: Error) => setError(err))
            .finally(() => setIsLoading(false))
    }

    return <Popover.Root>
        <Popover.Trigger>
            <Button>Create notification</Button>
        </Popover.Trigger>
        <Popover.Content>
            {isLoading
                ? <Flex justify='center' align='center'><Spinner size='3'/></Flex>
                : <Flex direction="column" gap='2'>
                    <Text weight='bold'>
                        Notice!
                    </Text>
                    <Text>
                        Once created, notification cannot be altered or cancelled.
                    </Text>
                    <TextInput
                        label='Heading'
                        name='heading'
                        control={control}
                    />
                    <TextAreaInput
                        label='Text'
                        name='text'
                        control={control}
                    />
                    {!!error && <ErrorHandler error={error}/>}
                    <Flex gap='2'>
                        <Popover.Close>
                            <Button>Cancel</Button>
                        </Popover.Close>
                        <Popover.Close>
                            <Button onClick={handleSubmit(onSubmit)} color='grass'>
                                Submit
                            </Button>
                        </Popover.Close>
                    </Flex>
                </Flex>}
        </Popover.Content>
    </Popover.Root>
}