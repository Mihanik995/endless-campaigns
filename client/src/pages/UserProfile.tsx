import Header from "../components/Header.tsx";
import {Card, Container, Flex, IconButton, Spinner, Table, TextField, Tooltip} from "@radix-ui/themes";
import {type ChangeEvent, type MouseEventHandler, useEffect, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import {useParams} from "react-router";
import {useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";
import {CheckIcon, Cross2Icon, EnvelopeClosedIcon, Pencil2Icon} from "@radix-ui/react-icons";
import PasswordChangeButton from "../components/PasswordChangeButton.tsx";

interface UserData {
    username: string;
    email: string;
}

export default function () {
    const auth = useAppSelector(selectAuth);
    const {idParam} = useParams()
    const id = idParam ? idParam : auth.id;

    const [isLoading, setIsLoading] = useState(false)
    const [userData, setUserData] = useState<UserData>({
        username: '',
        email: '',
    });
    useEffect(() => {
        setIsLoading(true)
        axios.get(`/auth/${id}`)
            .then(res => {
                if (res.status === 200) setUserData({...res.data});
            }).catch(err => console.log(err))
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
        axios.put(`/auth/${id}`, userData)
            .then((response) => {
                if (response.status === 200) {
                    setUserData({...response.data})
                    setEdit(false)
                }
            }).catch((error) => console.log(error))
    }

    return (
        <>
            <Header/>
            <Flex minHeight='80vh' align='center' justify='center' className='pt-25 pb-10'>
                <Card>
                    {isLoading
                        ? <Spinner/>
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
                                            <Flex width='25vw'>
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
                                            <Flex width='25vw'>
                                            {userData.email}
                                            </Flex>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Flex gap='2' width='25vw'>
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
                                                        <Tooltip content='Change E-mail'>
                                                            <IconButton radius='full'>
                                                                <EnvelopeClosedIcon/>
                                                            </IconButton>
                                                        </Tooltip>
                                                        <PasswordChangeButton/>
                                                    </>}
                                            </Flex>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table.Root>
                        </Container>
                    }
                </Card>
            </Flex>
        </>
    )
}