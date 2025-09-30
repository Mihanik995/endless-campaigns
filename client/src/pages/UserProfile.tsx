import Header from "../components/Header.tsx";
import {Card, Container, DataList, Flex, IconButton, Spinner, Text, TextField, Tooltip} from "@radix-ui/themes";
import {type ChangeEvent, type MouseEventHandler, useEffect, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import {useParams} from "react-router";
import {useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";
import {CheckIcon, Cross2Icon, Pencil2Icon} from "@radix-ui/react-icons";
import PasswordChangeButton from "../components/PasswordChangeButton.tsx";
import EmailChangeButton from "../components/EmailChangeButton.tsx";
import UserCampaigns from "../components/UserCampaigns.tsx";
import ErrorHandler from "../components/ErrorHandler.tsx";
import type {User} from "../types.ts";
import validateData from "../utils/validators/validateData.ts";
import CheckInput from "../components/CheckInput.tsx";
import SelectInput from "../components/SelectInput.tsx";

export default function () {
    const auth = useAppSelector(selectAuth);
    const {idParam} = useParams()
    const id = idParam ? idParam : auth.id as string;
    const isOwner = id === auth.id

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()
    const [userData, setUserData] = useState<User>({
        id,
        username: '',
        email: '',
        allowPlatformNotification: false,
        notifications: 'none'
    });
    useEffect(() => {
        setIsLoading(true)
        axios.get(`/auth/${id}`)
            .then(res => {
                if (res.status === 200) setUserData({...res.data});
            }).catch(err => setError(err as Error))
            .finally(() => setIsLoading(false))
    }, [])

    const [edit, setEdit] = useState(false)
    const handleProfileChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserData({
            ...userData,
            [event.target.name]: event.target.value
        })
        console.log(userData)
    }

    const handleSelect = (value: string) => {
        setUserData({
            ...userData,
            notifications: value as 'none' | 'email' | 'telegram'
        })
    }

    const handleSwitch = (name: string) => {
        setUserData({
            ...userData,
            [name]: !userData[name]
        })
    }

    const [updateError, setUpdateError] = useState<Error>()
    const [isUpdating, setIsUpdating] = useState(false)
    const handleSubmitProfileChange: MouseEventHandler<HTMLButtonElement> = () => {
        setIsUpdating(true)
        try {
            validateData<User>(userData)
            axios.put(`/auth/${id}`, userData)
                .then((response) => {
                    if (response.status === 200) {
                        setUserData({...response.data})
                        setEdit(false)
                    }
                })
        } catch (error) {
            setUpdateError(error as Error)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <>
            <Header/>
            <Flex minHeight='80vh' align='center' justify='center' className='pt-25 pb-10'>
                <Card>
                    {isLoading
                        ? <Spinner/>
                        : !!error
                            ? <ErrorHandler error={error}/>
                            : <Container width='100vw'>
                                {isUpdating
                                    ? <Flex justify='center'><Spinner size='3'/></Flex>
                                    : <Card size='3'>
                                        <Flex direction={{
                                            initial: 'column',
                                            xs: 'row'
                                        }} justify='between' gap='3'>
                                            <Flex direction={'column'} gap='3'>
                                                <DataList.Root orientation={{
                                                    initial: 'vertical',
                                                    xs: 'horizontal'
                                                }}>
                                                    <DataList.Item>
                                                        <DataList.Label>
                                                            <Text size='3' weight='bold'>
                                                                Username
                                                            </Text>
                                                        </DataList.Label>
                                                        <DataList.Value>
                                                            {edit
                                                                ? <TextField.Root
                                                                    name='username'
                                                                    value={userData.username}
                                                                    onChange={handleProfileChange}
                                                                />
                                                                : <Text size='3'>
                                                                    {userData.username}
                                                                </Text>}
                                                        </DataList.Value>
                                                    </DataList.Item>
                                                    <DataList.Item>
                                                        <DataList.Label>
                                                            <Text size='3' weight='bold'>
                                                                E-mail
                                                            </Text>
                                                        </DataList.Label>
                                                        <DataList.Value>
                                                            <Text size='3'>
                                                                {userData.email}
                                                            </Text>
                                                        </DataList.Value>
                                                    </DataList.Item>
                                                    <DataList.Item>
                                                        <DataList.Label>
                                                            <Text size='3' weight='bold'>
                                                                Telegram ID
                                                            </Text>
                                                        </DataList.Label>
                                                        <DataList.Value>
                                                            {edit
                                                                ? <TextField.Root
                                                                    name='telegramId'
                                                                    value={userData.telegramId}
                                                                    onChange={handleProfileChange}
                                                                />
                                                                : <Text size='3'>
                                                                    {userData.telegramId || '-'}
                                                                </Text>}
                                                        </DataList.Value>
                                                    </DataList.Item>
                                                    <DataList.Item>
                                                        <DataList.Label>
                                                            <Text size='3' weight='bold'>
                                                                Notifications
                                                            </Text>
                                                        </DataList.Label>
                                                        {edit
                                                            ?<SelectInput
                                                                size='2'
                                                                value={userData.notifications}
                                                                onValueChange={handleSelect}
                                                                options={{
                                                                    none: 'None',
                                                                    email: 'E-mail',
                                                                    telegram: 'Telegram'
                                                                }}
                                                            />
                                                            : <Text size='3'>
                                                                {userData.notifications[0].toUpperCase() +
                                                                    userData.notifications.slice(1)}
                                                            </Text>
                                                        }
                                                    </DataList.Item>
                                                </DataList.Root>
                                                {edit &&
                                                    <CheckInput
                                                        label={'Allow Endless Campaigns to ' +
                                                            'send you notifications about platform ' +
                                                            'changes and updates.'}
                                                        value={Number(userData.allowPlatformNotification)}
                                                        name='allowPlatformNotification'
                                                        onClick={() => handleSwitch('allowPlatformNotification')}
                                                    />
                                                }
                                            </Flex>
                                            {isOwner &&
                                                <Flex gap='2' direction={{
                                                    initial: 'row',
                                                    xs: 'column'
                                                }}>
                                                    {edit
                                                        ? <>
                                                            <Tooltip content='Cancel'>
                                                                <IconButton
                                                                    radius='full'
                                                                    onClick={() => setEdit(false)}
                                                                >
                                                                    <Cross2Icon/>
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip content='Submit'>
                                                                <IconButton
                                                                    radius='full'
                                                                    color='grass'
                                                                    onClick={handleSubmitProfileChange}
                                                                >
                                                                    <CheckIcon/>
                                                                </IconButton>
                                                            </Tooltip>
                                                        </>
                                                        : <>
                                                            <Tooltip content='Edit profile'>
                                                                <IconButton
                                                                    radius='full'
                                                                    onClick={() => setEdit(true)}
                                                                >
                                                                    <Pencil2Icon/>
                                                                </IconButton>
                                                            </Tooltip>
                                                            <EmailChangeButton/>
                                                            <PasswordChangeButton/>
                                                        </>}
                                                </Flex>
                                            }
                                        </Flex>
                                        {!!updateError && <ErrorHandler error={updateError}/>}
                                    </Card>
                                }
                                <br/>
                                <UserCampaigns id={id}/>
                            </Container>
                    }
                </Card>
            </Flex>
        </>
    )
}