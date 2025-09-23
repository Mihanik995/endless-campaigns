import Header from "../components/Header.tsx";
import {Box, Button, Card, Flex, Separator, Spinner} from "@radix-ui/themes";
import TextInput from "../components/TextInput.tsx";
import TextAreaInput from "../components/TextAreaInput.tsx";
import {type ChangeEventHandler, type MouseEventHandler, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import {useNavigate} from "react-router";
import ErrorHandler from "../components/ErrorHandler.tsx";
import type {SimpleMissionCreate} from "../types.ts";

type InputElement = HTMLInputElement | HTMLTextAreaElement

export default function () {
    const [missionData, setMissionData] = useState<SimpleMissionCreate>({
        title: '',
        narrativeDescription: '',
        missionConditions: '',
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()
    const navigate = useNavigate()

    const handleChange: ChangeEventHandler<InputElement> = function (e) {
        setMissionData({
            ...missionData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit: MouseEventHandler<HTMLButtonElement> = function (e) {
        e.preventDefault();
        setIsLoading(true);

        axios.post('/missions/simple', missionData)
            .then(res => {
                if (res.status === 201) navigate('/dashboard')
            }).catch(err => setError(err))
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
                                    value={missionData.title}
                                    onChange={handleChange}
                                />
                                <TextAreaInput
                                    label='Narrative description'
                                    name='narrativeDescription'
                                    value={missionData.narrativeDescription}
                                    onChange={handleChange}
                                />
                                <TextAreaInput
                                    label='Mission conditions'
                                    name='missionConditions'
                                    value={missionData.missionConditions}
                                    onChange={handleChange}
                                />
                                <Separator size='4'/>
                                <Button onClick={handleSubmit}>
                                    Create
                                </Button>
                            </Flex>
                        }
                        {!!error && <ErrorHandler error={error}/> }
                    </Card>
                </Box>
            </Flex>
        </>)

}