import Header from "../components/Header.tsx";
import {Button, Card, Flex, Heading} from "@radix-ui/themes";
import TextInput from "../components/TextInput.tsx";
import {type MouseEventHandler, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "../components/ErrorHandler.tsx";

export default function () {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<Error>()

    const [email, setEmail] = useState('')
    const handleSubmit: MouseEventHandler<HTMLButtonElement> = function (e) {
        e.preventDefault();
        axios.post('/auth/forgot-password', {email})
            .then(res => {
                if (res.status === 200) {
                    setSuccess(true)
                }
            }).catch((err) => setError(err as Error))
    }

    return <>
        <Header/>
        <Flex height='100vh' justify='center' align='center'>
            <Card size='4'>
                {success
                    ? <Heading>We've sent you the restoration e-mail.</Heading>
                    : <Flex direction='column' gap='3'>
                        <TextInput
                            label='Input your e-mail'
                            name='email'
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {!!error && <ErrorHandler error={error}/>}
                        <Button onClick={handleSubmit}>Submit</Button>
                    </Flex>}
            </Card>
        </Flex>
    </>
}