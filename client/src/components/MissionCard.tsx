import {
    Button,
    Card,
    Container,
    Em,
    Flex,
    Heading,
    IconButton,
    Popover,
    Separator,
    Text,
    Tooltip
} from "@radix-ui/themes";
import {type MouseEventHandler, useState} from "react";
import axios from "../axios/axiosConfig.ts"
import TextInput from "./TextInput.tsx";
import TextAreaInput from "./TextAreaInput.tsx";
import {CheckIcon, Cross2Icon, Pencil2Icon, Share1Icon, TrashIcon} from "@radix-ui/react-icons";
import {useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import {useNavigate} from "react-router";
import type {Mission} from "../types.ts";
import WYSIWYGInput from "./WYSIWYGInput.tsx";
import {type SubmitHandler, useForm} from "react-hook-form";

interface Props {
    clickable: boolean
    onDelete: () => void
    mission: Mission
    owner?: boolean
}

export default function ({clickable, onDelete, mission, owner}: Props) {
    const [missionData, setMissionData] = useState<Mission>(mission)
    const {control, handleSubmit} = useForm<Mission>({
        defaultValues: mission,
        mode: "onBlur"
    })
    const [edit, setEdit] = useState(false)
    const [error, setError] = useState<Error>()

    const auth = useAppSelector(selectAuth);
    const isOwner = owner !== undefined ? owner : auth.id === missionData.creatorId;

    const navigate = useNavigate()

    const handleDelete: MouseEventHandler<HTMLButtonElement> = () => {
        axios.delete(`/missions/${missionData.id}`)
            .then((response) => {
                if (response.status === 204) onDelete()
            }).catch((error) => setError(error as Error))
    }

    const onSubmit: SubmitHandler<Mission> = (data) => {
        delete data.nodes
        axios.put<Mission>(`/missions/${missionData.id}`, data)
            .then((response) => {
                if (response.status === 200) {
                    setMissionData(response.data)
                    setEdit(false)
                }
            })
            .catch((error) => setError(error as Error))
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
                                    label='Narrative description'
                                    name='narrativeDescription'
                                    control={control}
                                />
                                <WYSIWYGInput
                                    label='Missionc conditions'
                                    name='missionConditions'
                                    control={control}
                                />
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
                                    if (clickable) navigate(`/missions/${missionData.id}`)
                                }}
                                className={`${clickable && 'cursor-pointer'}`}
                            >
                                <Heading>{missionData.title}</Heading>
                                <Separator size='4' my='2'/>
                                <Text><Em>{missionData.narrativeDescription}</Em></Text>
                                {!!missionData.missionConditions &&
                                    <>
                                        <Separator size='4' my='2'/>
                                        <Text>
                                            <div
                                                dangerouslySetInnerHTML={{__html: missionData.missionConditions}}
                                                className='ProseMirror'
                                            />
                                        </Text>
                                    </>
                                }
                            </Flex>
                            <Flex direction={{
                                initial: 'row',
                                xs: 'column'
                            }} align='end' justify='start' gap='2'>
                                {isOwner &&
                                    <>
                                        <Tooltip content='Edit'>
                                            <IconButton radius='full' onClick={() => setEdit(true)}>
                                                <Pencil2Icon/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip content='Edit Mission Nodes'>
                                            <IconButton radius='full' onClick={() => {
                                                navigate(`/missions/${missionData.id}/edit-nodes`)
                                            }}
                                            >
                                                <Share1Icon/>
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