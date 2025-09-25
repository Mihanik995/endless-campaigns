import {type ReactElement, useEffect, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import {useParams} from "react-router";
import Header from "../components/Header.tsx";
import {Card, Flex, Heading, Spinner, Text} from "@radix-ui/themes";
import ErrorHandler from "../components/ErrorHandler.tsx";

export default function (): ReactElement {
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()
    const {token} = useParams();

    useEffect(() => {
        setIsLoading(true)
        axios.get(`/auth/verify/${token}`)
            .then(res => {
                if (res.status === 200) {
                    setSuccess(true);
                }
            }).catch(err => setError(err as Error))
            .finally(() => setIsLoading(false))
    }, [])

    return (
        <>
            <Header/>
            <Flex height='100vh' align='center' justify='center'>
                <Card size='3'>
                    {isLoading
                        ? <Spinner size='3'/>
                        : success
                            ? <>
                                <Heading>Your verification passed successfully!</Heading>
                                <Text>You can Log in now!</Text>
                            </>

                            : !!error && <ErrorHandler error={error}/>}
                </Card>
            </Flex>
        </>)
}