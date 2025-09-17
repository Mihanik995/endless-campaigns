import Header from "../components/Header.tsx";
import {Box, Button, Callout, Card, Container, Flex, Separator, Spinner} from "@radix-ui/themes";
import {type ChangeEventHandler, type MouseEventHandler, useState} from "react";
import TextInput from "../components/TextInput.tsx";
import TextAreaInput from "../components/TextAreaInput.tsx";
import axios from "../axios/axiosConfig.ts";
import {useNavigate} from "react-router";
import {InfoCircledIcon} from "@radix-ui/react-icons";
import CheckInput from "../components/CheckInput.tsx";

interface CampaignData {
    [key: string]: string | boolean | Date;

    title: string;
    description: string;
    regulations: string;
    dateStart: string | Date;
    dateEnd: string | Date;
    requiresRegisterApproval: boolean
}

type InputElement = HTMLInputElement | HTMLTextAreaElement

export default function () {
    const [campaignData, setCampaignData] = useState<CampaignData>({
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

        const dateStart = new Date(campaignData.dateStart)
        dateStart.setHours(0, 0, 0, 0)
        const dateEnd = new Date(campaignData.dateEnd)
        dateEnd.setHours(0, 0, 0, 0)

        setCampaignData({...campaignData, dateStart, dateEnd})

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
                        {!!error &&
                            <Callout.Root color='red'>
                                <Callout.Icon>
                                    <InfoCircledIcon/>
                                </Callout.Icon>
                                <Callout.Text>
                                    {error}
                                </Callout.Text>
                            </Callout.Root>}
                    </Card>
                </Box>
            </Flex>
        </>
    )
}