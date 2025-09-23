import Header from "../components/Header.tsx";
import {Card, Container, Flex, IconButton, Spinner, Table, TextField, Tooltip} from "@radix-ui/themes";
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

export default function () {
    const auth = useAppSelector(selectAuth);
    const {idParam} = useParams()
    const id = idParam ? idParam : auth.id as string;

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()
    const [userData, setUserData] = useState<User>({
        id,
        username: '',
        email: '',
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
    }
    const handleSubmitProfileChange: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        console.log(userData)
        axios.put(`/auth/${id}`, userData)
            .then((response) => {
                if (response.status === 200) {
                    setUserData({...response.data})
                    setEdit(false)
                }
            }).catch((error) => setError(error as Error))
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
                                <Table.Root mx='5'>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.ColumnHeaderCell>
                                                Username
                                            </Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell>
                                                E-mail
                                            </Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell>
                                                Actions
                                            </Table.ColumnHeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.RowHeaderCell>
                                                <Flex width='20vw'>
                                                    {edit
                                                        ? <TextField.Root
                                                            name='username'
                                                            value={userData.username}
                                                            onChange={handleProfileChange}
                                                        />
                                                        : userData.username}
                                                </Flex>
                                            </Table.RowHeaderCell>
                                            <Table.Cell>
                                                <Flex width='20vw'>
                                                    {userData.email}
                                                </Flex>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Flex gap='2' width='20vw'>
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
                                            </Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table.Root>
                                <br/>
                                <UserCampaigns id={id as string}/>
                            </Container>
                    }
                </Card>
            </Flex>
        </>
    )
}