import {type ChangeEventHandler, type MouseEventHandler, useState} from "react";
import {Button, Dialog, Flex, Separator, Spinner} from "@radix-ui/themes";
import TextInput from "./TextInput.tsx";
import type {MissionNodeData} from "../types.ts";
import TextAreaInput from "./TextAreaInput.tsx";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import {type Node, useReactFlow} from '@xyflow/react'
import validateData from "../utils/validators/validateData.ts";

interface Props {
    source: Node
    open: boolean
    setOpen: (open: boolean) => void
}

export default function ({source, open, setOpen}: Props) {
    const {setNodes} = useReactFlow()

    const [nodeData, setNodeData] = useState<MissionNodeData>({
        label: source.data.label as string,
        buttonLabel: source.data.label as string,
        description: source.data.description as string
    });
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
            axios.put(`missions/nodes/${source.id}`, nodeData)
                .then(res => {
                    if (res.status === 200) {
                        setNodes((prev) => prev.map(node => {
                            return node.id === source.id
                                ? {
                                    id: node.id,
                                    position: node.position,
                                    data: nodeData,
                                    type: 'missionNode'
                                }
                                : node
                        }))
                        setOpen(false)
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