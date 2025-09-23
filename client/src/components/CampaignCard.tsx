import {
    Button,
    Card,
    Container,
    Flex, Grid,
    Heading,
    IconButton,
    Link,
    Popover,
    Separator,
    Text,
    Tooltip
} from "@radix-ui/themes";
import {type ChangeEvent, type MouseEventHandler, useState} from "react";
import axios from "../axios/axiosConfig.ts"
import TextInput from "./TextInput.tsx";
import TextAreaInput from "./TextAreaInput.tsx";
import {CheckIcon, Cross2Icon, ExitIcon, Pencil2Icon, TrashIcon, UpdateIcon} from "@radix-ui/react-icons";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";
import CheckInput from "./CheckInput.tsx";
import ErrorHandler from "./ErrorHandler.tsx";
import {cleanCampaign, selectCampaign, updateCampaign} from "../app/features/campaign/campaignSlice.ts";
import type {Campaign} from "../types.ts";

interface Props {
    campaignData: Campaign
    clickable: boolean
    onDelete: () => void
}

export default function ({clickable, onDelete, campaignData}: Props) {
    const [campaign, setCampaign] = useState<Campaign>(campaignData)
    const [edit, setEdit] = useState(false)
    const [error, setError] = useState<Error>()

    const auth = useAppSelector(selectAuth);
    const {id} = useAppSelector(selectCampaign);
    const dispatch = useAppDispatch();
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
            }).catch((error) => setError(error as Error))
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
            }).catch((error) => setError(error as Error))
    }

    const handleUpdate: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()

        axios.get(`/campaigns/${campaign.id}`)
            .then((response) => {
                if (response.status === 200) {
                    dispatch(updateCampaign(response.data))
                }
            }).catch((error) => setError(error as Error))
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
                                        value={campaign.dateStart.slice(0, 10)}
                                        onChange={handleChange}
                                    />
                                    <TextInput
                                        label='End Date'
                                        name='dateEnd'
                                        type='date'
                                        value={campaign.dateEnd.slice(0, 10)}
                                        onChange={handleChange}
                                    />
                                </Flex>
                                <CheckInput
                                    value={Number(campaign.requiresRegisterApproval)}
                                    name='requiresRegisterApproval'
                                    onClick={() => handleSwitch('requiresRegisterApproval')}
                                    label='Player register requires master approval'
                                />
                                <Separator size='4'/>
                                <Grid my='2' columns="2" gap="3" width="auto">
                                    <CheckInput
                                        name='requiresPairingResultsApproval'
                                        value={Number(campaign.requiresPairingResultsApproval)}
                                        onClick={() => handleSwitch('requiresPairingResultsApproval')}
                                        label='Pairings results should be approved by campaign master'
                                    />
                                    <CheckInput
                                        name='requiresPairingReport'
                                        disabled={!campaign.requiresPairingResultsApproval}
                                        value={Number(campaign.requiresPairingReport)}
                                        onClick={() => handleSwitch('requiresPairingReport')}
                                        label='Players should attach the link to the pairing report'
                                    />
                                </Grid>
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
                                    if (clickable) dispatch(updateCampaign(campaign))
                                }}
                                className={`${clickable && 'cursor-pointer'}`}
                            >
                                <Heading>{campaign.title}</Heading>
                                <Separator size='4' my='2'/>
                                <Text>{campaign.description}</Text>
                                <Separator size='4' my='2'/>
                                <Text>
                                    Regulations:{' '}
                                    <Link href={campaign.regulations} target='_blank'>
                                        {campaign.regulations}
                                    </Link>
                                </Text>
                                <Separator size='4' my='2'/>
                                <Text>Dates: {
                                    new Date(campaign.dateStart).toLocaleDateString()
                                } - {
                                    new Date(campaign.dateEnd).toLocaleDateString()
                                }</Text>
                            </Flex>
                            <Flex direction='column' align='end' justify='start' gap='2'>
                                {!!id.length &&
                                    <>
                                        <Tooltip content='Exit'>
                                            <IconButton
                                                radius='full'
                                                onClick={() => dispatch(cleanCampaign())}
                                            >
                                                <ExitIcon/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip content='Refresh'>
                                            <IconButton
                                                radius='full'
                                                onClick={handleUpdate}
                                            >
                                                <UpdateIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                }
                                {isOwner &&
                                    <>
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
                                    </>
                                }
                            </Flex>
                        </>
                    }
                    {!!error && <ErrorHandler error={error}/>}
                </Flex>
            </Card>
        </Container>
    )
}