import Header from "../components/Header.tsx";
import {Button, Card, Flex, Heading} from "@radix-ui/themes";
import TextInput from "../components/TextInput.tsx";
import {useState} from "react";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "../components/ErrorHandler.tsx";
import {type SubmitHandler, useForm} from "react-hook-form";

interface Email {
    email: string;
}

export default function () {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<Error>()

    const {control, handleSubmit} = useForm<Email>({
        mode: "onBlur"
    })
    const onSubmit: SubmitHandler<Email> = function (data) {
        axios.post('/auth/forgot-password', data)
            .then(res => {
                if (res.status === 200) {
                    setSuccess(true)
                }
            })
            .catch((error) => setError(error as Error))
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
                            control={control}
                        />
                        {!!error && <ErrorHandler error={error}/>}
                        <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
                    </Flex>}
            </Card>
        </Flex>
    </>
}