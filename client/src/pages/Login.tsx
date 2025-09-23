import {type ChangeEvent, type MouseEventHandler, type ReactElement, useState} from "react";
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

export default function (): ReactElement {
    const [loginData, setLoginData] = useState<UserLogin>({
        username: '', password: '', rememberMe: false,
    })

    const auth = useAppSelector(selectAuth)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const handleChange = function (e: ChangeEvent<HTMLInputElement>) {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        })
    }

    const handleSwitch = (name: string) => {
        setLoginData({
            ...loginData,
            [name]: !loginData[name]
        })
    }

    const handleSubmit: MouseEventHandler<HTMLButtonElement> = function (e) {
        e.preventDefault();
        const {username, password} = loginData;
        if (!(username && password)) {
            alert("Please fill the required fields");
            return;
        }
        dispatch(login({username, password}))
    }

    return (
        <>
            <Header/>
            <Flex height='100vh' align='center' justify='center'>
                <Card size='4'>
                    {auth.success
                        ? <Navigate to='/dashboard' replace/>
                        : auth.error
                            ? <ErrorHandler error={auth.error as Error}/>
                            : <Flex direction='column' gap='3'>
                                <TextInput
                                    label='Username'
                                    name='username'
                                    value={loginData.username}
                                    onChange={handleChange}
                                    icon={<PersonIcon/>}
                                />
                                <Flex direction='column'>
                                    <TextInput
                                        label='Password'
                                        name='password'
                                        type='password'
                                        value={loginData.password}
                                        onChange={handleChange}
                                        icon={<LockClosedIcon/>}
                                    />
                                    <Link href='' size='1' onClick={() => navigate('/auth/forgot-password')}>
                                        Forgot password?
                                    </Link>
                                </Flex>
                                <CheckInput
                                    name='rememberMe'
                                    value={Number(loginData.rememberMe)}
                                    label='Remember Me'
                                    onClick={() => handleSwitch('rememberMe')}
                                />
                                <Separator size='4'/>
                                <Button
                                    onClick={handleSubmit}
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