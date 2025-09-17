import {type ChangeEvent, type MouseEventHandler, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import {Button, Flex, IconButton, Popover, Tooltip} from "@radix-ui/themes";
import {DotsHorizontalIcon} from "@radix-ui/react-icons";
import {useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";
import TextInput from "./TextInput.tsx";

interface NewPassword {
    password: string;
    confirmPassword: string;
}

export default function () {
    const {id} = useAppSelector(selectAuth);

    const [newPassword, setNewPassword] = useState<NewPassword>({
        password: '',
        confirmPassword: '',
    })
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setNewPassword({
            ...newPassword,
            [event.target.name]: event.target.value
        })
    }
    const handleSubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        if (newPassword.password !== newPassword.confirmPassword) return
        axios.put(`/auth/${id}/change-password`, {password: newPassword.password})
            .then((response) => {
                if (response.status === 200) console.log('Password changed successfully.')
            }).catch(error => console.log(error));
    }

    return (
        <Popover.Root>
            <Tooltip content='Change Password'>
                <Popover.Trigger>
                    <IconButton radius='full'>
                        <DotsHorizontalIcon/>
                    </IconButton>
                </Popover.Trigger>
            </Tooltip>
            <Popover.Content>
                <Flex direction='column' gap='2'>
                    <TextInput
                        label='Password'
                        name='password'
                        type='password'
                        value={newPassword.password}
                        onChange={handleChange}
                    />
                    <TextInput
                        label='Confirm Password'
                        name='confirmPassword'
                        type='password'
                        value={newPassword.confirmPassword}
                        onChange={handleChange}
                    />
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
            </Popover.Content>
        </Popover.Root>
    )
}