import Header from "../components/Header.tsx";
import {useParams} from "react-router";
import {useEffect, useState} from "react";
import axios from "axios";
import {Card, Flex, Heading, Spinner, Text} from "@radix-ui/themes";
import ErrorHandler from "../components/ErrorHandler.tsx";
import {refresh} from "../app/features/auth/authSlice.ts";
import {useAppDispatch} from "../app/hooks.ts";

export default function () {
    const dispatch = useAppDispatch();

    const {token} = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<Error>()
    useEffect(() => {
        setIsLoading(true)
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/restore-access/${token}`)
            .then(res => {
                if (res.status === 200) {
                    dispatch(refresh(res.data))
                    setSuccess(true)
                }
            }).catch(error => setError(error as Error))
            .finally(() => setIsLoading(false))
    }, []);

    return <>
        <Header/>
        <Flex height='100vh' align='center' justify='center'>
            <Card size='4'>
                {isLoading
                    ? <Spinner size='3'/>
                    : !!error
                        ? <ErrorHandler error={error}/>
                        : success &&
                        <>
                            <Heading size='5'>You've successfully logged in!</Heading>
                            <Text>You can now change your password in your profile.</Text>
                        </>
                }
            </Card>
        </Flex>
    </>
}