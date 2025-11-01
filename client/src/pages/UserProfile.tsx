import Header from "../components/Header.tsx";
import {Card, Container, DataList, Flex, IconButton, Spinner, Text, Tooltip} from "@radix-ui/themes";
import {useEffect, useState} from "react";
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
import CheckInput from "../components/CheckInput.tsx";
import SelectInput from "../components/SelectInput.tsx";
import {type SubmitHandler, useForm} from "react-hook-form";
import TextInput from "../components/TextInput.tsx";

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
    const {control, handleSubmit, reset} = useForm<User>({
        mode: "onBlur"
    });
    useEffect(() => {
        setIsLoading(true)
        axios.get(`/auth/${id}`)
            .then(res => {
                if (res.status === 200) {
                    setUserData({...res.data})
                    reset({...res.data})
                    setError(undefined)
                }
            }).catch(err => setError(err as Error))
            .finally(() => setIsLoading(false))
    }, [])

    const [edit, setEdit] = useState(false)

    const [updateError, setUpdateError] = useState<Error>()
    const [isUpdating, setIsUpdating] = useState(false)
    const onSubmitProfileChange: SubmitHandler<User> = (data) => {
        setIsUpdating(true)
        axios.put(`/auth/${id}`, data)
            .then((response) => {
                if (response.status === 200) {
                    setUserData({...response.data})
                    setEdit(false)
                    setError(undefined)
                }
            })
            .catch((error) => setUpdateError(error as Error))
            .finally(() => setIsUpdating(false))
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
                                                                ? <TextInput
                                                                    name='username'
                                                                    control={control}
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
                                                                ? <TextInput
                                                                    name='telegramId'
                                                                    control={control}
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
                                                            ? <SelectInput
                                                                size='2'
                                                                name='notifications'
                                                                control={control}
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
                                                        name='allowPlatformNotification'
                                                        control={control}
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
                                                                    onClick={handleSubmit(onSubmitProfileChange)}
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