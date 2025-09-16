import {Button, Card, Container, Flex, Heading, IconButton, Popover, Separator, Text} from "@radix-ui/themes";
import {type ChangeEvent, type MouseEventHandler, useState} from "react";
import axios from "../axios/axiosConfig.ts"
import TextInput from "./TextInput.tsx";
import TextAreaInput from "./TextAreaInput.tsx";
import {CheckIcon, Cross2Icon, Pencil2Icon} from "@radix-ui/react-icons";

interface CampaignData {
    id: string;
    title: string,
    description: string,
    regulations: string,
    dateStart: string | Date,
    dateEnd: string | Date,
}

export default function (campaignData: CampaignData) {
    const [campaign, setCampaign] = useState<CampaignData>({
        id: campaignData.id,
        title: campaignData.title,
        description: campaignData.description,
        regulations: campaignData.regulations,
        dateStart: new Date(campaignData.dateStart),
        dateEnd: new Date(campaignData.dateEnd)
    })
    const [edit, setEdit] = useState(false)
    const [deleted, setDeleted] = useState(false)

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setCampaign({
            ...campaign,
            [e.target.name]: e.target.value
        })
    }

    const handleDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()

        axios.delete(`/campaigns/${campaign.id}`)
            .then((response) => {
                if (response.status === 204) setDeleted(true)
            }).catch((error) => console.log(error))
    }

    const handleSubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()

        axios.put(`/campaigns/${campaign.id}`, campaign)
            .then((response) => {
                if (response.status === 200) {
                    setCampaign({
                        id: response.data.id,
                        title: response.data.title,
                        description: response.data.description,
                        regulations: response.data.regulations,
                        dateStart: new Date(response.data.dateStart),
                        dateEnd: new Date(response.data.dateEnd)
                    })
                    setEdit(false)
                }
            }).catch((error) => console.log(error))
    }

    return !deleted &&
        <Container m='3' width='100vw'>
            <Card size='3' m='3'>
                <Flex gap='3'>
                    {edit
                        ? <>
                            <Flex width='100vw' direction='column' gap='3'>
                                <TextInput
                                    label='Title'
                                    name='title'
                                    value={campaign.title}
                                    onChange={handleChange}
                                />
                                <TextAreaInput
                                    label='Description'
                                    name='description'
                                    value={campaign.description}
                                    onChange={handleChange}
                                />
                                <TextInput
                                    label='Regulations'
                                    name='regulations'
                                    value={campaign.regulations}
                                    onChange={handleChange}
                                />
                                <Flex gap='3' justify='start'>
                                    <TextInput
                                        label='Start Date'
                                        name='dateStart'
                                        type='date'
                                        value={typeof campaign.dateStart === 'string'
                                            ? campaign.dateStart
                                            : campaign.dateStart.toDateString()}
                                        onChange={handleChange}
                                    />
                                    <TextInput
                                        label='End Date'
                                        name='dateEnd'
                                        type='date'
                                        value={typeof campaign.dateEnd === 'string'
                                            ? campaign.dateEnd
                                            : campaign.dateEnd.toDateString()}
                                        onChange={handleChange}
                                    />
                                </Flex>
                            </Flex>
                            <Flex direction='column' align='end' justify='start' gap='3'>
                                <IconButton radius='full' onClick={() => setEdit(false)}>
                                    <Cross2Icon/>
                                </IconButton>
                                <IconButton radius='full' color='grass' onClick={handleSubmit}>
                                    <CheckIcon/>
                                </IconButton>
                            </Flex>
                        </>
                        : <>
                            <Flex width='100%' direction='column' align='start'>
                                <Heading>{campaign.title}</Heading>
                                <Separator size='4' my='2'/>
                                <Text>{campaign.description}</Text>
                                <Separator size='4' my='2'/>
                                <Text>Regulations: {campaign.regulations}</Text>
                                <Separator size='4' my='2'/>
                                <Text>Dates: {typeof campaign.dateStart === 'string'
                                    ? campaign.dateStart
                                    : campaign.dateStart.toLocaleDateString()
                                } - {typeof campaign.dateEnd === 'string'
                                    ? campaign.dateEnd
                                    : campaign.dateEnd.toLocaleDateString()
                                }</Text>
                            </Flex>
                            <Flex direction='column' align='end' justify='start' gap='3'>
                                <IconButton radius='full' onClick={() => setEdit(true)}>
                                    <Pencil2Icon/>
                                </IconButton>
                                <Popover.Root>
                                    <Popover.Trigger>
                                        <IconButton radius='full' color='red'>
                                            <Cross2Icon/>
                                        </IconButton>
                                    </Popover.Trigger>
                                    <Popover.Content>
                                        <Flex direction='column' gap='2'>
                                            <Heading>Are you sure?</Heading>
                                            <Text>This action cannot be undone!</Text>
                                            <Flex gap='2'>
                                                <Popover.Close>
                                                    <Button>Cancel</Button>
                                                </Popover.Close>
                                                <Popover.Close>
                                                    <Button color='red' onClick={handleDelete}>Delete</Button>
                                                </Popover.Close>
                                            </Flex>
                                        </Flex>
                                    </Popover.Content>
                                </Popover.Root>
                            </Flex>
                        </>
                    }
                </Flex>
            </Card>
        </Container>
}