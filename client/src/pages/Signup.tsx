import {type ChangeEvent, type MouseEventHandler, type ReactElement, useState} from "react";
import Header from "../components/Header.tsx";
import axios from "axios";
import {Button, Card, Flex, Heading, Separator, Text} from "@radix-ui/themes";
import {EnvelopeClosedIcon, LockClosedIcon, PersonIcon} from "@radix-ui/react-icons";
import TextInput from "../components/TextInput.tsx";

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
                                        <TextInput
                                            label='Username'
                                            name='username'
                                            value={registerData.username}
                                            onChange={handleChange}
                                            icon={<PersonIcon/>}
                                        />
                                        <TextInput
                                            label='E-mail'
                                            type='email'
                                            name='email'
                                            value={registerData.email}
                                            onChange={handleChange}
                                            icon={<EnvelopeClosedIcon/>}
                                        />
                                    </Flex>
                                    <Flex direction='column' gap='3'>
                                        <TextInput
                                            label='Password'
                                            type='password'
                                            name='password'
                                            value={registerData.password}
                                            onChange={handleChange}
                                            icon={<LockClosedIcon/>}
                                        />
                                        <TextInput
                                            label='Confirm Password'
                                            type='password'
                                            name='confirmPassword'
                                            value={registerData.confirmPassword}
                                            onChange={handleChange}
                                            icon={<LockClosedIcon/>}
                                        />
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