import {type ChangeEvent, type MouseEventHandler, type ReactElement, useState} from "react";
import Header from "../components/Header.tsx";
import axios from "axios";
import {Button, Card, Flex, Heading, Separator, Text, TextField} from "@radix-ui/themes";
import {EnvelopeClosedIcon, LockClosedIcon, PersonIcon} from "@radix-ui/react-icons";

interface RegisterData {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
}

export default function (): ReactElement {
    const [registerData, setRegisterData] = useState<RegisterData>({
        username: '',
        password: '',
        confirmPassword: '',
        email: ''
    })

    const handleChange = function (e: ChangeEvent<HTMLInputElement>) {
        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit: MouseEventHandler<HTMLButtonElement> = function (e) {
        e.preventDefault();
        const {username, password, confirmPassword, email} = registerData;
        if (!(username && password && confirmPassword && email)) {
            alert("Please fill the required fields");
            return;
        }
        if (password !== confirmPassword) {
            alert("Password must match");
            return;
        }
        axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
            {username, password, email},
            {headers: {'Content-Type': 'application/json'}}
        )
            .then(res => {
                if (res.status === 201) {
                    setSuccess(true)
                } else {
                    console.log(res.data)
                }
            })
    }

    const [success, setSuccess] = useState(false)

    return (
        <>
            <Header/>
            <Flex height='100vh' align='center' justify='center'>
                <Card size='4' mx='5'>
                    {success
                        ? <>
                            <Heading>You've registered successfully!</Heading>
                            <Text>Check your e-mail to verify your account.</Text>
                        </>
                        : <form>
                            <Flex direction='column' gap='3'>
                                <Flex
                                    direction={{
                                        initial: 'column',
                                        sm: 'row'
                                    }}
                                    gap='3'>
                                    <Flex direction='column' gap='3'>
                                        <Text as='label' size='5'>
                                            Username:{' '}
                                            <TextField.Root
                                                name='usesrname'
                                                value={registerData.username}
                                                onChange={handleChange}
                                                size='3'
                                            >
                                                <TextField.Slot>
                                                    <PersonIcon/>
                                                </TextField.Slot>
                                            </TextField.Root>
                                        </Text>
                                        <Text as='label' size='5'>
                                            E-mail:{' '}
                                            <TextField.Root
                                                type='email'
                                                name='email'
                                                value={registerData.email}
                                                onChange={handleChange}
                                                size='3'
                                            >
                                                <TextField.Slot>
                                                    <EnvelopeClosedIcon/>
                                                </TextField.Slot>
                                            </TextField.Root>
                                        </Text>
                                    </Flex>
                                    <Flex direction='column' gap='3'>
                                        <Text as='label' size='5'>
                                            Password:{' '}
                                            <TextField.Root
                                                type='password'
                                                name='password'
                                                value={registerData.username}
                                                onChange={handleChange}
                                                size='3'
                                            >
                                                <TextField.Slot>
                                                    <LockClosedIcon/>
                                                </TextField.Slot>
                                            </TextField.Root>
                                        </Text>
                                        <Text as='label' size='5'>
                                            Confirm Password:{' '}
                                            <TextField.Root
                                                type='password'
                                                name='confirmPassword'
                                                value={registerData.confirmPassword}
                                                onChange={handleChange}
                                                size='3'
                                            >
                                                <TextField.Slot>
                                                    <LockClosedIcon/>
                                                </TextField.Slot>
                                            </TextField.Root>
                                        </Text>
                                    </Flex>
                                </Flex>
                                <Separator size='4'/>
                                <Button
                                    onClick={handleSubmit}
                                    size='3'
                                >
                                    Register
                                </Button>
                            </Flex>
                        </form>
                    }
                </Card>
            </Flex>
        </>
    )
}