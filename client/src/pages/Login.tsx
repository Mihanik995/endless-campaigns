import {type ReactElement, useState} from "react";
import Header from "../components/Header.tsx";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {login, selectAuth} from "../app/features/auth/authSlice.ts";
import {Button, Card, Flex, Link, Separator} from "@radix-ui/themes";
import {LockClosedIcon, PersonIcon} from "@radix-ui/react-icons";
import {Navigate, useNavigate} from "react-router";
import TextInput from "../components/TextInput.tsx";
import type {UserLogin} from "../types.ts";
import ErrorHandler from "../components/ErrorHandler.tsx";
import CheckInput from "../components/CheckInput.tsx";
import {useForm} from "react-hook-form";

export default function (): ReactElement {
    const {control, handleSubmit} = useForm<UserLogin>({
        defaultValues: {
            rememberMe: false
        },
        mode: "onBlur"
    })

    const auth = useAppSelector(selectAuth)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [error, setError] = useState<Error>()

    const onSubmit = (data: UserLogin) => {
        try {
            dispatch(login(data))
        } catch (error) {
            setError(error as Error)
        }
    }

    return (
        <>
            <Header/>
            <Flex height='100vh' align='center' justify='center' direction='column' gap='3'>
                <Card size='4'>
                    {auth.success
                        ? <Navigate to='/dashboard' replace/>
                        : <Flex direction='column' gap='3'>
                            <TextInput
                                label='Username'
                                name='username'
                                control={control}
                                icon={<PersonIcon/>}
                            />
                            <Flex direction='column'>
                                <TextInput
                                    label='Password'
                                    name='password'
                                    control={control}
                                    type='password'
                                    icon={<LockClosedIcon/>}
                                />
                                <Link href='' size='1' onClick={() => navigate('/auth/forgot-password')}>
                                    Forgot password?
                                </Link>
                            </Flex>
                            <CheckInput
                                name='rememberMe'
                                control={control}
                                label='Remember Me'
                            />
                            <Separator size='4'/>
                            {!!error && <ErrorHandler error={error}/>}
                            {!!auth.error && <ErrorHandler error={auth.error as Error}/>}
                            <Button
                                onClick={handleSubmit(onSubmit)}
                                size='3'
                            >
                                Log In
                            </Button>
                        </Flex>
                    }
                </Card>
            </Flex>
        </>
    )
}