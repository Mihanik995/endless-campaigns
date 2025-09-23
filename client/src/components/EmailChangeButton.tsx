import {Button, Flex, IconButton, Popover, Strong, Text, Tooltip} from "@radix-ui/themes";
import {EnvelopeClosedIcon} from "@radix-ui/react-icons";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {logout, selectAuth} from "../app/features/auth/authSlice.ts";
import {type MouseEventHandler, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import TextInput from "./TextInput.tsx";
import ErrorHandler from "./ErrorHandler.tsx";

export default function () {
    const {id} = useAppSelector(selectAuth);
    const dispatch = useAppDispatch();
    const [error, setError] = useState<Error>()

    const [newEmail, setNewEmail] = useState<string>('')
    const handleSubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        axios.put(`/auth/${id}/change-email`, {email: newEmail})
            .then((response) => {
                if (response.status === 200) dispatch(logout())
            }).catch(err => setError(err as Error));
    }

    return (
        <Popover.Root>
            <Tooltip content='Change E-mail'>
                <Popover.Trigger>
                    <IconButton radius='full'>
                        <EnvelopeClosedIcon/>
                    </IconButton>
                </Popover.Trigger>
            </Tooltip>
            <Popover.Content>
                <Flex direction='column' gap='2'>
                    <TextInput
                        label='Email'
                        name='email'
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                    />
                    <Text>
                        <Strong>Notice!</Strong> After the submission you'll be logged out and have to verify your new e-mail.
                    </Text>
                    <Flex gap='2'>
                        <Popover.Close>
                            <Button>
                                Cancel
                            </Button>
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
                    {!!error && <ErrorHandler error={error}/>}
                </Flex>
            </Popover.Content>
        </Popover.Root>
    )
}