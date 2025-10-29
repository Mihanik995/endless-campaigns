import {useState} from "react";
import axios from "../axios/axiosConfig.ts";
import {Button, Flex, IconButton, Popover, Strong, Text, Tooltip} from "@radix-ui/themes";
import {DotsHorizontalIcon} from "@radix-ui/react-icons";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {logout, selectAuth} from "../app/features/auth/authSlice.ts";
import TextInput from "./TextInput.tsx";
import ErrorHandler from "./ErrorHandler.tsx";
import {type SubmitHandler, useForm} from "react-hook-form";

interface NewPassword {
    [key: string]: string;

    password: string;
    confirmPassword: string;
}

export default function () {
    const {id} = useAppSelector(selectAuth);
    const dispatch = useAppDispatch();
    const [error, setError] = useState<Error>()

    const {control, handleSubmit, watch} = useForm<NewPassword>({
        mode: "onBlur"
    })
    const onSubmit: SubmitHandler<NewPassword> = (data) => {
        axios.put(`/auth/${id}/change-password`, {password: data.password})
            .then((response) => {
                if (response.status === 200) dispatch(logout())
            })
            .catch((error) => setError(error as Error))
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
                        control={control}
                        rules={{
                            minLength: {
                                value: 8,
                                message: 'Password should be minimum 8 symbols length',
                            }
                        }}
                    />
                    <TextInput
                        label='Confirm Password'
                        name='confirmPassword'
                        type='password'
                        control={control}
                        rules={{
                            validate: (value: string)  =>
                                value === watch('password') || "Passwords don't match"
                        }}
                    />
                    <Text>
                        <Strong>Notice!</Strong> After the submission you'll be logged out.
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
                                onClick={handleSubmit(onSubmit)}
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