import {type ChangeEventHandler, type MouseEventHandler, useState} from "react";
import {Button, Dialog, Flex, Separator, Spinner} from "@radix-ui/themes";
import TextInput from "./TextInput.tsx";
import type {MissionNodeCreate} from "../types.ts";
import TextAreaInput from "./TextAreaInput.tsx";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import {type Node, useReactFlow} from '@xyflow/react'
import validateData from "../utils/validators/validateData.ts";

interface Props {
    source: Node
    startNode?: boolean
    open: boolean
    setOpen: (open: boolean) => void
}

export default function ({source, startNode = false, open, setOpen}: Props) {
    const {addNodes, addEdges} = useReactFlow()

    const initialState: MissionNodeCreate = {
        label: '', buttonLabel: '', description: '',
        positionX: source.position.x,
        positionY: source.position.y + 75,
        missionId: startNode ? source.id : undefined,
    }

    const [nodeData, setNodeData] = useState<MissionNodeCreate>(initialState);
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()

    const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        setNodeData({
            ...nodeData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
        setIsLoading(true)
        try {
            validateData(nodeData)
            axios.post('/missions/nodes', nodeData)
                .then(res => {
                    if (res.status === 201) {
                        addNodes({
                            id: res.data.id,
                            position: {x: res.data.positionX, y: res.data.positionY},
                            data: {
                                label: res.data.label,
                                buttonLabel: res.data.buttonLabel,
                                description: res.data.description,
                            },
                            type: 'missionNode'
                        })
                        setNodeData(initialState)
                        if (!startNode) return axios.post('/missions/node-links', {
                            fromId: source.id,
                            toId: res.data.id,
                        })
                        else addEdges({
                            id: startNode ? '0' : `${source.id}-${res.data.id}`,
                            source: source.id,
                            target: res.data.id,
                            animated: true
                        })
                    }
                })
                .then(res => {
                    if (res && res.status === 201) {
                        console.log(res.data)
                        addEdges({
                            id: `${res.data.fromId}-${res.data.toId}`,
                            source: res.data.fromId,
                            target: res.data.toId,
                            animated: true
                        })
                    }
                })
        } catch (err) {
            e.preventDefault()
            setError(err as Error)
        } finally {
            setIsLoading(false)
        }
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
                            value={nodeData.label}
                            onChange={handleChange}
                        />
                        <TextInput
                            label='Button label'
                            placeholder='button sign for players to choose the path'
                            name='buttonLabel'
                            value={nodeData.buttonLabel}
                            onChange={handleChange}
                        />
                        <TextAreaInput
                            label='Description'
                            name='description'
                            value={nodeData.description}
                            onChange={handleChange}
                        />
                        <Separator size='4'/>
                        {!!error && <ErrorHandler error={error}/>}
                        <Flex gap='2'>
                            <Dialog.Close>
                                <Button>Cancel</Button>
                            </Dialog.Close>
                            <Dialog.Close>
                                <Button color='grass' onClick={handleSubmit}>
                                    Submit
                                </Button>
                            </Dialog.Close>
                        </Flex>
                    </Flex>}
            </Dialog.Content>
        </Dialog.Root>
    )
}