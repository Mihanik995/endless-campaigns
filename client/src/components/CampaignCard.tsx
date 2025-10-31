import {
    Button,
    Card,
    Container,
    Flex,
    Grid,
    Heading,
    IconButton,
    Link,
    Popover,
    Separator,
    Text,
    Tooltip
} from "@radix-ui/themes";
import {type MouseEventHandler, useState} from "react";
import axios from "../axios/axiosConfig.ts"
import TextInput from "./TextInput.tsx";
import TextAreaInput from "./TextAreaInput.tsx";
import {CheckIcon, Cross2Icon, ExitIcon, Pencil2Icon, TrashIcon} from "@radix-ui/react-icons";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";
import CheckInput from "./CheckInput.tsx";
import ErrorHandler from "./ErrorHandler.tsx";
import {cleanCampaign, selectCampaign, updateCampaign} from "../app/features/campaign/campaignSlice.ts";
import type {Campaign} from "../types.ts";
import {type SubmitHandler, useForm} from "react-hook-form";

interface Props {
    campaignData: Campaign
    clickable: boolean
    onDelete: () => void
}

function toInputDateFormat(date: string): string {
    const [day, month, year] = date.split('.');
    return `${year}-${month}-${day}`;
}

export default function ({clickable, onDelete, campaignData}: Props) {
    const [campaign, setCampaign] = useState<Campaign>(campaignData);
    const {control, handleSubmit, watch} = useForm<Campaign>({
        defaultValues: {
            ...campaignData,
            dateStart: toInputDateFormat(campaignData.dateStart),
            dateEnd: toInputDateFormat(campaignData.dateEnd)
        },
        mode: "onBlur"
    })
    const [edit, setEdit] = useState(false)
    const [error, setError] = useState<Error>()

    const auth = useAppSelector(selectAuth);
    const {id} = useAppSelector(selectCampaign);
    const dispatch = useAppDispatch();
    const isOwner = auth.id === campaignData.ownerId;

    const handleDelete: MouseEventHandler<HTMLButtonElement> = () => {
        axios.delete(`/campaigns/${campaign.id}`)
            .then((response) => {
                if (response.status === 204) onDelete()
            }).catch((error) => setError(error as Error))
    }

    const onSubmit: SubmitHandler<Campaign> = (data) => {
        try {
            axios.put<Campaign>(`/campaigns/${campaign.id}`, data)
                .then((response) => {
                    if (response.status === 200) {
                        setCampaign({
                            ...response.data,
                            dateStart: new Date(response.data.dateStart).toLocaleDateString(),
                            dateEnd: new Date(response.data.dateEnd).toLocaleDateString(),
                        })
                        setEdit(false)
                    }
                })
        } catch (error) {
            setError(error as Error)
        }
    }

    return (
        <Container width='100vw'>
            <Card size='3' m='2'>
                <Flex gap='3' direction={{
                    initial: 'column',
                    xs: 'row'
                }}>
                    {edit
                        ? <>
                            <Flex width='100vw' direction='column' gap='3'>
                                <TextInput
                                    label='Title'
                                    name='title'
                                    control={control}
                                />
                                <TextAreaInput
                                    label='Description'
                                    name='description'
                                    control={control}
                                />
                                <TextInput
                                    label='Regulations'
                                    name='regulations'
                                    control={control}
                                />
                                <Flex gap='3' justify='start'>
                                    <TextInput
                                        label='Start Date'
                                        name='dateStart'
                                        type='date'
                                        control={control}
                                    />
                                    <TextInput
                                        label='End Date'
                                        name='dateEnd'
                                        type='date'
                                        control={control}
                                    />
                                </Flex>
                                <CheckInput
                                    name='requiresRegisterApproval'
                                    label='Player register requires master approval'
                                    control={control}
                                />
                                <Separator size='4'/>
                                <Grid my='2' columns="2" gap="3" width="auto">
                                    <CheckInput
                                        name='requiresPairingResultsApproval'
                                        label='Pairings results should be approved by campaign master'
                                        control={control}
                                    />
                                    <CheckInput
                                        name='requiresPairingReport'
                                        disabled={!watch('requiresPairingResultsApproval')}
                                        label='Players should attach the link to the pairing report'
                                        control={control}
                                    />
                                </Grid>
                                <Separator size='4'/>
                                <CheckInput
                                    label='Campaign uses assets'
                                    name='usesAssets'
                                    control={control}
                                />
                                {watch('usesAssets') &&
                                    <TextInput
                                        control={control}
                                        name='assetsTitle'
                                        label='Assets Title'
                                        placeholder='one word explaining what your assets are'
                                    />
                                }
                            </Flex>
                            <Flex direction={{
                                initial: 'row',
                                xs: 'column'
                            }} align='end' justify='start' gap='3'>
                                <Tooltip content='Cancel'>
                                    <IconButton radius='full' onClick={() => setEdit(false)}>
                                        <Cross2Icon/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip content='Submit'>
                                    <IconButton radius='full' color='grass' onClick={handleSubmit(onSubmit)}>
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
                                    if (clickable) dispatch(updateCampaign(campaign.id))
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
                                <Text>Dates: {campaign.dateStart} - {campaign.dateEnd}</Text>
                                <Separator size='4' my='2'/>
                                <Text>
                                    Campaign Link:{' '}
                                    <Link href={`https://www.endless-campaigns.com/campaigns/${campaign.id}`}
                                          target='_blank'>
                                        https://www.endless-campaigns.com/campaigns/{campaign.id}
                                    </Link>
                                </Text>
                            </Flex>
                            <Flex direction={{
                                initial: 'row',
                                xs: 'column'
                            }} align='end' justify='start' gap='2'>
                                {!!id.length &&
                                    <Tooltip content='Exit'>
                                        <IconButton
                                            radius='full'
                                            onClick={() => dispatch(cleanCampaign())}
                                        >
                                            <ExitIcon/>
                                        </IconButton>
                                    </Tooltip>
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