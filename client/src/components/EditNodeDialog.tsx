import {useState} from "react";
import {Button, Dialog, Flex, Separator, Spinner} from "@radix-ui/themes";
import TextInput from "./TextInput.tsx";
import type {MissionNodeData} from "../types.ts";
import TextAreaInput from "./TextAreaInput.tsx";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import {type Node, useReactFlow} from '@xyflow/react'
import WYSIWYGInput from "./WYSIWYGInput.tsx";
import {type SubmitHandler, useForm} from "react-hook-form";

interface Props {
    source: Node
    open: boolean
    setOpen: (open: boolean) => void
}

export default function ({source, open, setOpen}: Props) {
    const {setNodes} = useReactFlow()

    const {control, handleSubmit} = useForm<MissionNodeData>({
        defaultValues: {
            label: source.data.label as string,
            buttonLabel: source.data.label as string,
            narrativeDescription: source.data.narrativeDescription as string,
            missionConditions: source.data.missionConditions as string
        },
        mode: "onBlur"
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()

    const onSubmit: SubmitHandler<MissionNodeData> = (data) => {
        setIsLoading(true)
        axios.put(`missions/nodes/${source.id}`, data)
            .then(res => {
                if (res.status === 200) {
                    setNodes((prev) => prev.map(node => {
                        return node.id === source.id
                            ? {
                                id: node.id,
                                position: node.position,
                                data: data,
                                type: 'missionNode'
                            }
                            : node
                    }))
                    setOpen(false)
                }
            }).catch((err) => setError(err as Error))
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