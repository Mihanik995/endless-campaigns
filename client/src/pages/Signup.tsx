import {type ChangeEvent, type MouseEventHandler, type ReactElement, useState} from "react";
import Header from "../components/Header.tsx";
import axios from "axios";
import {Button, Card, Flex, Heading, Link, Separator, Text} from "@radix-ui/themes";
import {EnvelopeClosedIcon, LockClosedIcon, PersonIcon} from "@radix-ui/react-icons";
import TextInput from "../components/TextInput.tsx";
import type {UserRegister} from "../types.ts";
import validateData from "../utils/validators/validateData.ts";
import validatePassword from "../utils/validators/validatePassword.ts";
import ErrorHandler from "../components/ErrorHandler.tsx";
import CheckInput from "../components/CheckInput.tsx";
import SelectInput from "../components/SelectInput.tsx";

export default function (): ReactElement {
    const [error, setError] = useState<Error>()
    const [registerData, setRegisterData] = useState<UserRegister>({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        notifications: 'none',
        allowPlatformNotification: false
    })

    const handleChange = function (e: ChangeEvent<HTMLInputElement>) {
        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.value
        })
    }

    const handleSelect = (name: string, value: string) => {
        setRegisterData({
            ...registerData,
            [name]: value
        })
    }

    const handleSwitch = (name: string) => {
        setRegisterData({
            ...registerData,
            [name]: !registerData[name]
        })
    }

    const handleSubmit: MouseEventHandler<HTMLButtonElement> = function (e) {
        e.preventDefault();
        try {
            validateData<UserRegister>(registerData)
            validatePassword<UserRegister>(registerData)
            axios.post(
                import.meta.env.VITE_BACKEND_URL
                    ? `${import.meta.env.VITE_BACKEND_URL}/auth/register`
                    : `/api/auth/register`,
                registerData,
                {headers: {'Content-Type': 'application/json'}}
            ).then(res => {
                if (res.status === 201) setSuccess(true)
            })
        } catch (error) {
            setError(error as Error)
        }
    }

    const [success, setSuccess] = useState(false)

    return (
        <>
            <Header/>
            <Flex height='100vh' align='center' justify='center' className='pt-15'>
                <Card size='4' mx='5'>
                    {success
                        ? <>
                            <Heading>You've registered successfully!</Heading>
                            <Text>Check your e-mail to verify your account.</Text>
                        </>
                        : <form>
                            <Flex direction='column' gap='3' width='50vh'>
                                <Flex
                                    direction={{
                                        initial: 'column',
                                        xs: 'row'
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
                                <SelectInput
                                    label='Notifications'
                                    value={registerData.notifications}
                                    onValueChange={
                                        (value) => handleSelect('notifications', value)
                                    }
                                    options={{
                                        none: 'None',
                                        email: 'E-mail',
                                        telegram: 'Telegram'
                                    }}
                                    hint={<Text>If you want to get notifications via Telegram,
                                        you'll have to register in our {' '}
                                        <Link href='https://t.me/endless_campaigns_bot' target='_blank'>
                                            Telegram bot
                                        </Link>.
                                    </Text>}
                                />
                                <CheckInput
                                    label='Platform Noitifications'
                                    value={Number(registerData.allowPlatformNotification)}
                                    name='allowPlatformNotification'
                                    onClick={() => handleSwitch('allowPlatformNotification')}
                                    hint={<Text>
                                        Allow Endless Campaigns to send you
                                        notifications about platform changes and updates.
                                </Text>}
                                />
                                <Separator size='4'/>
                                {!!error && <ErrorHandler error={error}/>}
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