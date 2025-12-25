import {useEffect, useState} from "react";
import {Button, Dialog, Flex, Separator, Spinner} from "@radix-ui/themes";
import TextInput from "./TextInput.tsx";
import type {MissionNode, MissionNodeCreate} from "../types.ts";
import TextAreaInput from "./TextAreaInput.tsx";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import {type Node, useReactFlow} from '@xyflow/react'
import WYSIWYGInput from "./WYSIWYGInput.tsx";
import {type SubmitHandler, useForm} from "react-hook-form";

interface Props {
    source: Node
    startNode?: boolean
    open: boolean
    setOpen: (open: boolean) => void
}

export default function ({source, startNode = false, open, setOpen}: Props) {
    const {addNodes, addEdges} = useReactFlow()

    const {control, handleSubmit, reset} = useForm<MissionNodeCreate>({
        defaultValues: {
            positionX: 0,
            positionY: 0,
            missionId: source.data.missionId as string,
            isMissionStart: startNode
        },
        mode: "onBlur"
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()

    useEffect(() => {
        reset({
            positionX: source.position.x,
            positionY: source.position.y + 75,
            missionId: source.data.missionId as string,
            isMissionStart: startNode
        })
    }, [source]);

    const onSubmit: SubmitHandler<MissionNodeCreate> = (data) => {
        setIsLoading(true)
        axios.post<MissionNode>('/missions/nodes', data)
            .then(res => {
                if (res.status === 201) {
                    setError(undefined)
                    addNodes({
                        id: res.data.id,
                        position: {x: res.data.positionX, y: res.data.positionY},
                        data: {
                            label: res.data.label,
                            buttonLabel: res.data.buttonLabel,
                            narrativeDescription: res.data.narrativeDescription,
                            missionConditions: res.data.missionConditions,
                            missionId: res.data.missionId
                        },
                        type: 'missionNode'
                    })
                    if (!startNode) return axios.post('/missions/node-links', {
                        fromId: source.id,
                        toId: res.data.id,
                    })
                    else {
                        addEdges({
                            id: '0',
                            source: source.id,
                            target: res.data.id,
                            animated: true
                        })
                        setOpen(false)
                    }
                }
            })
            .then(res => {
                if (res && res.status === 201) {
                    setError(undefined)
                    addEdges({
                        id: `${res.data.id}`,
                        source: res.data.fromId,
                        target: res.data.toId,
                        type: 'customEdge',
                        animated: true
                    })
                    setOpen(false)
                }
            })
            .catch((err) => setError(err as Error))
            .finally(() => setIsLoading(false))
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Content width='50vw' minWidth='300px'>
                <Dialog.Title/>
                <Dialog.Description/>
                {isLoading
                    ? <Spinner size='3'/>
                    : <Flex direction='column' gap='2'>
                        <TextInput
                            label='Node label'
                            placeholder='using only for mission editor navigation'
                            name='label'
                            control={control}
                        />
                        <TextInput
                            label='Button label'
                            placeholder='button sign for players to choose the path'
                            name='buttonLabel'
                            control={control}
                        />
                        <TextAreaInput
                            label='Narrative Description'
                            name='narrativeDescription'
                            control={control}
                        />
                        <WYSIWYGInput
                            label='Mission Conditions'
                            name='missionConditions'
                            control={control}
                        />
                        <Separator size='4'/>
                        {!!error && <ErrorHandler error={error}/>}
                        <Flex gap='2'>
                            <Dialog.Close>
                                <Button>Cancel</Button>
                            </Dialog.Close>
                            <Dialog.Close>
                                <Button color='grass' onClick={handleSubmit(onSubmit)}>
                                    Submit
                                </Button>
                            </Dialog.Close>
                        </Flex>
                    </Flex>}
            </Dialog.Content>
        </Dialog.Root>
    )
}