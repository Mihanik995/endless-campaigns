import Header from "../components/Header.tsx";
import {Box, Button, Card, Container, Flex, Separator, Spinner} from "@radix-ui/themes";
import {type ChangeEventHandler, type MouseEventHandler, useState} from "react";
import TextInput from "../components/TextInput.tsx";
import TextAreaInput from "../components/TextAreaInput.tsx";
import axios from "../axios/axiosConfig.ts";
import {useNavigate} from "react-router";
import CheckInput from "../components/CheckInput.tsx";
import ErrorHandler from "../components/ErrorHandler.tsx";
import type {Campaign} from "../types.ts";

type InputElement = HTMLInputElement | HTMLTextAreaElement

export default function () {
    const [campaignData, setCampaignData] = useState<Campaign>({
        id: '',
        ownerId: '',
        title: '',
        description: '',
        regulations: '',
        dateStart: '',
        dateEnd: '',
        requiresRegisterApproval: true
    })
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState()
    const navigate = useNavigate();

    const handleChange: ChangeEventHandler<InputElement> = function (e) {
        setCampaignData({
            ...campaignData,
            [e.target.name]: e.target.value
        })
    }

    const handleSwitch = (name: string) => {
        setCampaignData({
            ...campaignData,
            [name]: !(campaignData[name] as boolean)
        })
    }

    const handleSubmit: MouseEventHandler<HTMLButtonElement> = function (e) {
        e.preventDefault();
        setIsLoading(true);

        axios.post('/campaigns', campaignData)
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
                                    value={campaignData.title}
                                    onChange={handleChange}
                                />
                                <TextAreaInput
                                    label='Description'
                                    name='description'
                                    value={campaignData.description}
                                    onChange={handleChange}
                                />
                                <Flex gap='5'>
                                    <Flex direction='column' align='end' gap='3'>
                                        <TextInput
                                            label='Date Start'
                                            name='dateStart'
                                            type='date'
                                            value={campaignData.dateStart as string}
                                            onChange={handleChange}
                                        />
                                        <TextInput
                                            label='End Date'
                                            name='dateEnd'
                                            type='date'
                                            value={campaignData.dateEnd as string}
                                            onChange={handleChange}
                                        />
                                    </Flex>
                                    <Container>
                                        <Flex direction='column' gap='6'>
                                            <TextInput
                                                label='Regulations link'
                                                name='regulations'
                                                value={campaignData.regulations}
                                                onChange={handleChange}
                                            />
                                            <CheckInput
                                                name='requiresRegisterApproval'
                                                value={campaignData.requiresRegisterApproval as unknown as number}
                                                onClick={() => handleSwitch('requiresRegisterApproval')}
                                                label='Player register requires master approval'
                                            />
                                        </Flex>
                                    </Container>
                                </Flex>
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
        </>
    )
}