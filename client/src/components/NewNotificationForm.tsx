import {Button, Flex, Popover, Spinner, Text} from "@radix-ui/themes";
import TextInput from "./TextInput.tsx";
import {type ChangeEventHandler, type MouseEventHandler, useState} from "react";
import type {CustomNotification, CustomNotificationCreate} from "../types.ts";
import TextAreaInput from "./TextAreaInput.tsx";
import axios from "../axios/axiosConfig.ts";
import validateData from "../utils/validators/validateData.ts";
import ErrorHandler from "./ErrorHandler.tsx";

interface Props {
    campaignId: string;
    setNew: (notification: CustomNotification) => void
}

export default function ({campaignId, setNew}: Props) {
    const [newNotification, setNewNotification] = useState<CustomNotificationCreate>({
        heading: '', text: '', campaignId
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()

    const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        setNewNotification({
            ...newNotification,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit: MouseEventHandler<HTMLButtonElement> = () => {
        setIsLoading(true)
        try {
            validateData(newNotification)
            axios.post<CustomNotification>('/campaigns/notifications', newNotification)
                .then((res) => {
                    if (res.status === 201) {
                        setNew(res.data)
                    }
                }).catch((err: Error) => setError(err))
        } catch (error) {
            setError(error as Error)
        } finally {
            setIsLoading(false)
        }
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
                        value={newNotification.heading}
                        name='heading'
                        onChange={handleChange}
                    />
                    <TextAreaInput
                        label='Text'
                        value={newNotification.text}
                        name='text'
                        onChange={handleChange}
                    />
                    {!!error && <ErrorHandler error={error}/>}
                    <Flex gap='2'>
                        <Popover.Close>
                            <Button>Cancel</Button>
                        </Popover.Close>
                        <Popover.Close>
                            <Button onClick={handleSubmit} color='grass'>
                                Submit
                            </Button>
                        </Popover.Close>
                    </Flex>
                </Flex>}
        </Popover.Content>
    </Popover.Root>
}