import {type ReactElement, useState} from "react";
import Header from "../components/Header.tsx";
import axios from "axios";
import {Button, Card, Flex, Heading, Link, Separator, Text} from "@radix-ui/themes";
import {EnvelopeClosedIcon, LockClosedIcon, PersonIcon} from "@radix-ui/react-icons";
import TextInput from "../components/TextInput.tsx";
import type {UserRegister} from "../types.ts";
import ErrorHandler from "../components/ErrorHandler.tsx";
import CheckInput from "../components/CheckInput.tsx";
import SelectInput from "../components/SelectInput.tsx";
import {type SubmitHandler, useForm} from "react-hook-form";

export default function (): ReactElement {
    const [error, setError] = useState<Error>()
    const {control, handleSubmit, watch} = useForm<UserRegister>({
        defaultValues: {allowPlatformNotification: false},
        mode: "onBlur"
    })

    const onSubmit: SubmitHandler<UserRegister> = function (data) {
        axios.post(
            import.meta.env.VITE_BACKEND_URL
                ? `${import.meta.env.VITE_BACKEND_URL}/auth/register`
                : `/api/auth/register`,
            data,
            {headers: {'Content-Type': 'application/json'}}
        )
            .then(res => {
                if (res.status === 201) {
                    setSuccess(true)
                    setError(undefined)
                }
            })
            .catch((error) => setError(error as Error))
    }

    const [success, setSuccess] = useState(false)

    return (
        <>
            <Header/>
            <Flex height='100vh' align='center' justify='center' className='pt-40 pb-10'>
                <Card size={{
                    initial: '2',
                    xs: '4'
                }} mx='5'>
                    {success
                        ? <>
                            <Heading>You've registered successfully!</Heading>
                            <Text>Check your e-mail to verify your account.</Text>
                        </>
                        :
                        <Flex direction='column' gap='3'>
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
                                        control={control}
                                        icon={<PersonIcon/>}
                                    />
                                    <TextInput
                                        label='E-mail'
                                        type='email'
                                        name='email'
                                        control={control}
                                        icon={<EnvelopeClosedIcon/>}
                                        rules={{
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                message: 'Incorrect e-mail',
                                            },
                                            maxLength: {
                                                value: 254,
                                                message: 'Email is too long',
                                            },
                                        }}
                                    />
                                </Flex>
                                <Flex direction='column' gap='3'>
                                    <TextInput
                                        label='Password'
                                        type='password'
                                        name='password'
                                        control={control}
                                        rules={{
                                            minLength: {
                                                value: 8,
                                                message: 'Password should be minimum 8 symbols length',
                                            }
                                        }}
                                        icon={<LockClosedIcon/>}
                                    />
                                    <TextInput
                                        label='Confirm Password'
                                        type='password'
                                        name='confirmPassword'
                                        control={control}
                                        rules={{
                                            validate: (value: string) =>
                                                value === watch('password') || "Passwords don't match"
                                        }}
                                        icon={<LockClosedIcon/>}
                                    />
                                </Flex>
                            </Flex>
                            <Flex direction={{
                                initial: 'column',
                                xs: 'row'
                            }} gap='3' justify={{
                                initial: 'start',
                                xs: 'between'
                            }} align={{
                                initial: 'start',
                                xs: 'center'
                            }}>
                                <SelectInput
                                    label='Notifications'
                                    name='notifications'
                                    control={control}
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
                                    label='Platform News'
                                    name='allowPlatformNotification'
                                    control={control}
                                    hint={<Text>
                                        Allow Endless Campaigns to send you
                                        notifications about platform changes and updates.
                                    </Text>}
                                />
                            </Flex>
                            <Separator size='4'/>
                            {!!error && <ErrorHandler error={error}/>}
                            <Button
                                onClick={handleSubmit(onSubmit)}
                                size='3'
                            >
                                Register
                            </Button>
                        </Flex>
                    }
                </Card>
            </Flex>
        </>
    )
}