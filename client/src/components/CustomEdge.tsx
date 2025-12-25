import {BaseEdge, EdgeLabelRenderer, type EdgeProps, getBezierPath, useReactFlow} from "@xyflow/react";
import {IconButton, Spinner} from "@radix-ui/themes";
import {type MouseEventHandler, useState} from "react";
import {Cross2Icon} from "@radix-ui/react-icons";
import {Button, Dialog, Flex, Strong} from "@radix-ui/themes";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "./ErrorHandler.tsx";

export default function ({id, sourceX, sourceY, targetX, targetY, selected}: EdgeProps) {
    const {deleteElements} = useReactFlow()

    const [edgePath, labelX, labelY] = getBezierPath({sourceX, sourceY, targetX, targetY})
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()

    const handleDelete: MouseEventHandler<HTMLButtonElement> = () => {
        setIsLoading(true)
        if (id !== '0') axios.delete(`/missions/node-links/${id}`)
            .then(res => {
                if (res.status === 204) {
                    deleteElements({edges: [{id}]})
                    setOpen(false)
                    setError(undefined)
                }
            }).catch(err => setError(err as Error))
            .finally(() => setIsLoading(false))
    }

    return (
        <>
            <BaseEdge id={id} path={edgePath}/>
            {selected && <>
                <EdgeLabelRenderer>
                    <IconButton
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                            pointerEvents: 'all',
                        }}
                        className="nodrag nopan"
                        size='1'
                        radius='full'
                        color='red'
                        onClick={() => setOpen(true)}
                    >
                        <Cross2Icon/>
                    </IconButton>
                </EdgeLabelRenderer>
                <Dialog.Root open={open} onOpenChange={setOpen}>
                    <Dialog.Content width='50vw' minWidth='300px'>
                        {isLoading
                            ? <Flex justify='center'><Spinner/></Flex>
                            : !!error
                                ? <Flex justify='center'><ErrorHandler error={error}/></Flex>
                                : <>
                                    <Dialog.Title>
                                        Notice!
                                    </Dialog.Title>
                                    <Dialog.Description>
                                        All nodes with no connections with <Strong>ENTRYPOINT</Strong> will be lost!
                                    </Dialog.Description>
                                    <Flex gap='2' mt='3'>
                                        <Dialog.Close>
                                            <Button>Cancel</Button>
                                        </Dialog.Close>
                                        <Dialog.Close>
                                            <Button color='red' onClick={handleDelete}>Delete</Button>
                                        </Dialog.Close>
                                    </Flex>
                                </>
                        }
                    </Dialog.Content>
                </Dialog.Root>
            </>
            }
        </>
    )
}