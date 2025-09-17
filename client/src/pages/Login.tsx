import {type ChangeEvent, type MouseEventHandler, type ReactElement, useState} from "react";
import Header from "../components/Header.tsx";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {login} from "../app/features/auth/authSlice.ts";
import {Button, Card, Flex, Heading, Separator} from "@radix-ui/themes";
import {LockClosedIcon, PersonIcon} from "@radix-ui/react-icons";
import {Navigate} from "react-router";
import TextInput from "../components/TextInput.tsx";

interface LoginData {
    username: string;
    password: string;
}

export default function (): ReactElement {
    const [loginData, setLoginData] = useState<LoginData>({
        username: '',
        password: '',
    })

    const auth = useAppSelector(state => state.auth)
    const dispatch = useAppDispatch()

    const handleChange = function (e: ChangeEvent<HTMLInputElement>) {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
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
                            ? <Heading>{auth.error}</Heading>
                            : <form>
                                <Flex direction='column' gap='3'>
                                    <TextInput
                                        label='Username'
                                        name='username'
                                        value={loginData.username}
                                        onChange={handleChange}
                                        icon={<PersonIcon/>}
                                    />
                                    <TextInput
                                        label='Password'
                                        name='password'
                                        type='password'
                                        value={loginData.password}
                                        onChange={handleChange}
                                        icon={<LockClosedIcon/>}
                                    />
                                    <Separator size='4'/>
                                    <Button
                                        onClick={handleSubmit}
                                        size='3'
                                    >
                                        Log In
                                    </Button>
                                </Flex>
                            </form>
                    }
                </Card>
            </Flex>
        </>
    )
}