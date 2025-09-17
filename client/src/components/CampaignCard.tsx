import {Button, Card, Container, Flex, Heading, IconButton, Popover, Separator, Text, Tooltip} from "@radix-ui/themes";
import {type ChangeEvent, type MouseEventHandler, useState} from "react";
import axios from "../axios/axiosConfig.ts"
import TextInput from "./TextInput.tsx";
import TextAreaInput from "./TextAreaInput.tsx";
import {CheckIcon, Cross2Icon, Pencil2Icon, TrashIcon} from "@radix-ui/react-icons";
import {useNavigate} from "react-router";
import {useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";
import CheckInput from "./CheckInput.tsx";

interface CampaignData {
    [key: string]: string | boolean | Date | (() => void)

    id: string;
    ownerId: string;
    title: string,
    description: string,
    regulations: string,
    dateStart: string | Date,
    dateEnd: string | Date,
    requiresRegisterApproval: boolean
}

interface Props extends CampaignData {
    clickable: boolean
    onDelete: () => void
}

export default function ({clickable, onDelete, ...campaignData}: Props) {
    const [campaign, setCampaign] = useState<CampaignData>({
        ...campaignData,
        dateStart: new Date(campaignData.dateStart),
        dateEnd: new Date(campaignData.dateEnd)
    })
    const [edit, setEdit] = useState(false)
    const navigate = useNavigate();

    const auth = useAppSelector(selectAuth);
    const isOwner = auth.id === campaign.ownerId;

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setCampaign({
            ...campaign,
            [e.target.name]: e.target.value
        })
    }

    const handleSwitch = (name: string) => {
        setCampaign({
            ...campaign,
            [name]: !(campaign[name] as boolean)
        })
    }

    const handleDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()

        axios.delete(`/campaigns/${campaign.id}`)
            .then((response) => {
                if (response.status === 204) onDelete()
            }).catch((error) => console.log(error))
    }

    const handleSubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()

        axios.put(`/campaigns/${campaign.id}`, campaign)
            .then((response) => {
                if (response.status === 200) {
                    setCampaign({
                        ...response.data,
                        dateStart: new Date(response.data.dateStart),
                        dateEnd: new Date(response.data.dateEnd)
                    })
                    setEdit(false)
                }
            }).catch((error) => console.log(error))
    }

    return (
        <Container width='100vw'>
            <Card size='3' m='2'>
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
                                <CheckInput
                                    value={campaign.requiresRegisterApproval as unknown as number}
                                    name='requiresRegisterApproval'
                                    onClick={() => handleSwitch('requiresRegisterApproval')}
                                    label='Player register requires master approval'
                                />
                            </Flex>
                            <Flex direction='column' align='end' justify='start' gap='3'>
                                <Tooltip content='Cancel'>
                                    <IconButton radius='full' onClick={() => setEdit(false)}>
                                        <Cross2Icon/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip content='Submit'>
                                    <IconButton radius='full' color='grass' onClick={handleSubmit}>
                                        <CheckIcon/>
                                    </IconButton>
                                </Tooltip>
                            </Flex>
                        </>
                        : <>
                            <Flex
                                width='100%'
                                direction='column'
                                align='start'
                                onClick={() => {
                                    if (clickable) navigate(`/campaigns/${campaign.id}`)
                                }}
                                className={`${clickable && 'cursor-pointer'}`}
                            >
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
                            {isOwner &&
                                <Flex direction='column' align='end' justify='start' gap='3'>
                                    <Tooltip content='Edit'>
                                        <IconButton radius='full' onClick={() => setEdit(true)}>
                                            <Pencil2Icon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Popover.Root>
                                        <Tooltip content='Delete'>
                                            <Popover.Trigger>
                                                <IconButton radius='full' color='red'>
                                                    <TrashIcon/>
                                                </IconButton>
                                            </Popover.Trigger>
                                        </Tooltip>
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
                            }
                        </>
                    }
                </Flex>
            </Card>
        </Container>
    )
}