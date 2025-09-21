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
import {type ChangeEvent, type MouseEventHandler, useState} from "react";
import axios from "../axios/axiosConfig.ts"
import TextInput from "./TextInput.tsx";
import TextAreaInput from "./TextAreaInput.tsx";
import {CheckIcon, Cross2Icon, Pencil2Icon, TrashIcon} from "@radix-ui/react-icons";
import {useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import {useNavigate} from "react-router";

interface MissionData {
    [key: string]: string

    id: string;
    creatorId: string;
    title: string,
    narrativeDescription: string,
    missionConditions: string,
}

interface Props {
    clickable: boolean
    onDelete: () => void
    mission: MissionData
}

export default function ({clickable, onDelete, mission}: Props) {
    const [missionData, setMissionData] = useState<MissionData>({...mission})
    const [edit, setEdit] = useState(false)
    const [error, setError] = useState<Error>()

    const auth = useAppSelector(selectAuth);
    const isOwner = auth.id === missionData.creatorId;

    const navigate = useNavigate()

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setMissionData({
            ...missionData,
            [e.target.name]: e.target.value
        })
    }

    const handleDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()

        axios.delete(`/missions/simple/${missionData.id}`)
            .then((response) => {
                if (response.status === 204) onDelete()
            }).catch((error) => setError(error as Error))
    }

    const handleSubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()

        axios.put(`/missions/simple/${missionData.id}`, missionData)
            .then((response) => {
                if (response.status === 200) setEdit(false)
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
                                    label='Missionc conditions'
                                    name='missionConditions'
                                    value={missionData.missionConditions}
                                    onChange={handleChange}
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
                                    if (clickable) navigate(`/missions/${missionData.id}`)
                                }}
                                className={`${clickable && 'cursor-pointer'}`}
                            >
                                <Heading>{missionData.title}</Heading>
                                <Separator size='4' my='2'/>
                                <Text><Em>{missionData.narrativeDescription}</Em></Text>
                                <Separator size='4' my='2'/>
                                <Text>{missionData.missionConditions}</Text>
                            </Flex>
                            <Flex direction='column' align='end' justify='start' gap='2'>
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