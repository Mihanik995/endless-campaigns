import Header from "../components/Header.tsx";
import {Box, Button, Card, Flex, Select, Separator, Spinner} from "@radix-ui/themes";
import TextInput from "../components/TextInput.tsx";
import TextAreaInput from "../components/TextAreaInput.tsx";
import {type ChangeEventHandler, type MouseEventHandler, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import {useNavigate} from "react-router";
import ErrorHandler from "../components/ErrorHandler.tsx";
import type {MissionCreate} from "../types.ts";
import validateData from "../utils/validators/validateData.ts";
import validateString from "../utils/validators/validateString.ts";

type InputElement = HTMLInputElement | HTMLTextAreaElement
type Type = 'simple' | 'multi-step'

export default function () {
    const [missionData, setMissionData] = useState<MissionCreate>({
        title: '',
        narrativeDescription: '',
    })
    const [type, setType] = useState<Type>()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()
    const navigate = useNavigate()

    const handleChange: ChangeEventHandler<InputElement> = function (e) {
        setMissionData({
            ...missionData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit: MouseEventHandler<HTMLButtonElement> = function () {
        setIsLoading(true);

        try {
            validateString('Type', type as string)
            validateData<MissionCreate>(missionData)
            axios.post(`/missions`, missionData)
                .then(res => {
                    if (res.status === 201) navigate(`/missions/${res.data.id}`)
                })
        } catch (error) {
            setError(error as Error)
        } finally {
            setIsLoading(false);
        }
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
                                <Select.Root onValueChange={(value) => setType(value as Type)}>
                                    <Select.Trigger placeholder={'Select mission type'}/>
                                    <Select.Content>
                                        <Select.Item value='simple'>Simple mission</Select.Item>
                                        <Select.Item value='multi-step'>Multi-step mission</Select.Item>
                                    </Select.Content>
                                </Select.Root>
                                <TextAreaInput
                                    label='Narrative description'
                                    name='narrativeDescription'
                                    value={missionData.narrativeDescription}
                                    onChange={handleChange}
                                />
                                {type === 'simple' &&
                                    <TextAreaInput
                                        label='Mission conditions'
                                        name='missionConditions'
                                        value={missionData.missionConditions as string}
                                        onChange={handleChange}
                                    />
                                }
                                <Separator size='4'/>
                                <Button onClick={handleSubmit}>
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