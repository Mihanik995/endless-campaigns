import Header from "../components/Header.tsx";
import {Box, Button, Card, Flex, Separator, Spinner} from "@radix-ui/themes";
import TextInput from "../components/TextInput.tsx";
import TextAreaInput from "../components/TextAreaInput.tsx";
import {useState} from "react";
import axios from "../axios/axiosConfig.ts";
import {useNavigate} from "react-router";
import ErrorHandler from "../components/ErrorHandler.tsx";
import type {MissionCreate} from "../types.ts";
import WYSIWYGInput from "../components/WYSIWYGInput.tsx";
import {type SubmitHandler, useForm} from "react-hook-form";

export default function () {
    const {control, handleSubmit} = useForm<MissionCreate>({
        defaultValues: {missionConditions: ''},
        mode: "onBlur"
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()
    const navigate = useNavigate()

    const onSubmit: SubmitHandler<MissionCreate> = function (data) {
        setIsLoading(true);
        axios.post(`/missions`, data)
            .then(res => {
                if (res.status === 201) navigate(`/missions/${res.data.id}`)
            })
            .catch((error) => setError(error as Error))
            .finally(() => setIsLoading(false))
    }

    return (
        <>
            <Header/>
            <Flex height='100vh' align='center' justify='center'>
                <Box width='700px' position='relative' top='20px'>
                    <Card size='2'>
                        {isLoading
                            ? <Spinner size='3'/>
                            : <Flex direction='column' gap='3'>
                                <TextInput
                                    label='Title'
                                    name='title'
                                    control={control}
                                />
                                <TextAreaInput
                                    label='Narrative description'
                                    name='narrativeDescription'
                                    control={control}
                                />
                                <WYSIWYGInput
                                    label='Mission conditions'
                                    name='missionConditions'
                                    control={control}
                                />
                                <Separator size='4'/>
                                <Button onClick={handleSubmit(onSubmit)}>
                                    Create
                                </Button>
                            </Flex>
                        }
                        {!!error && <ErrorHandler error={error}/>}
                    </Card>
                </Box>
            </Flex>
        </>)

}