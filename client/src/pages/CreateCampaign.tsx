import Header from "../components/Header.tsx";
import {Button, Card, Container, Flex, Grid, Heading, Separator, Spinner} from "@radix-ui/themes";
import {type ChangeEventHandler, type MouseEventHandler, useState} from "react";
import TextInput from "../components/TextInput.tsx";
import TextAreaInput from "../components/TextAreaInput.tsx";
import axios from "../axios/axiosConfig.ts";
import {useNavigate} from "react-router";
import CheckInput from "../components/CheckInput.tsx";
import ErrorHandler from "../components/ErrorHandler.tsx";
import type {CampaignCreate} from "../types.ts";

type InputElement = HTMLInputElement | HTMLTextAreaElement

export default function () {
    const [campaignData, setCampaignData] = useState<CampaignCreate>({
        title: '',
        description: '',
        regulations: '',
        dateStart: '',
        dateEnd: '',
        requiresRegisterApproval: false,
        requiresPairingReport: false,
        requiresPairingResultsApproval: false,
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
            <Container maxWidth='700px' className='pb-5 pt-23'>
                <Card size='2'>
                    {isLoading
                        ? <Spinner size='3'/>
                        : <Flex align='center' justify='center'>
                            <Flex maxWidth='700px' direction='column' gap='2'>
                                <Heading>Essentials</Heading>
                                <Flex direction='column' gap='3'>
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
                                                    value={Number(campaignData.requiresRegisterApproval)}
                                                    onClick={() => handleSwitch('requiresRegisterApproval')}
                                                    label='Player register requires master approval'
                                                />
                                            </Flex>
                                        </Container>
                                    </Flex>
                                </Flex>
                                <Separator size='4'/>
                                <Heading>Pairings</Heading>
                                <Grid my='2' columns="2" gap="3" width="auto">
                                    <CheckInput
                                        name='requiresPairingResultsApproval'
                                        value={Number(campaignData.requiresPairingResultsApproval)}
                                        onClick={() => handleSwitch('requiresPairingResultsApproval')}
                                        label='Pairings results should be approved by campaign master'
                                    />
                                    <CheckInput
                                        name='requiresPairingReport'
                                        disabled={!campaignData.requiresPairingResultsApproval}
                                        value={Number(campaignData.requiresPairingReport)}
                                        onClick={() => handleSwitch('requiresPairingReport')}
                                        label='Players should attach the link to the pairing report'
                                    />
                                </Grid>
                                <Separator size='4'/>
                                <Button onClick={handleSubmit}>
                                    Create
                                </Button>
                            </Flex>
                        </Flex>
                    }
                    {!!error && <ErrorHandler error={error}/>}
                </Card>
            </Container>
        </>
    )
}