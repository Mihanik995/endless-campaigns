import {Button, Card, ContextMenu, Dialog, Flex, Spinner, Strong, Text} from "@radix-ui/themes";
import {Handle, type Node, type NodeProps, Position, useReactFlow} from "@xyflow/react";
import AddNodeDialog from "./AddNodeDialog.tsx";
import {type MouseEventHandler, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import EditNodeDialog from "./EditNodeDialog.tsx";

type MissionNode = Node<{ label: string, buttonLabel: string, description: string }, 'custom'>

export default function ({id, data, selected}: NodeProps<MissionNode>) {
    const {deleteElements, getNode} = useReactFlow()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()

    const handleDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        setIsLoading(true)
        axios.delete(`/missions/nodes/${id}`)
            .then(res => {
                if (res.status === 204) {
                    deleteElements({nodes: [{id}]})
                    setDeleteOpen(false)
                }
            }).catch(err => setError(err as Error))
            .finally(() => setIsLoading(false))
    }

    const [createOpen, setCreateOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)

    return (
        <>

            <Card className={selected ? 'border-1' : ''}>
                {isLoading
                    ? <Flex justify='center'>
                        <Spinner/>
                    </Flex>
                    : !!error
                        ? <ErrorHandler error={error}/>
                        : <ContextMenu.Root>
                            <ContextMenu.Trigger>
                                <Flex width='160px' justify='center' align='center' gap='3'>
                                    <Text weight='medium'>{data.label}</Text>
                                </Flex>
                            </ContextMenu.Trigger>
                            <ContextMenu.Content>
                                <ContextMenu.Item onSelect={() => setCreateOpen(true)}>
                                    Create Connected Node
                                </ContextMenu.Item>
                                <ContextMenu.Item onSelect={() => setEditOpen(true)}>
                                    Edit Node
                                </ContextMenu.Item>
                                <ContextMenu.Separator/>
                                <ContextMenu.Item
                                    color='red'
                                    onClick={() => setDeleteOpen(true)}
                                >
                                    Delete Node
                                </ContextMenu.Item>
                            </ContextMenu.Content>
                        </ContextMenu.Root>
                }
            </Card>
            <AddNodeDialog
                source={getNode(id) as Node}
                open={createOpen}
                setOpen={setCreateOpen}
            />
            <EditNodeDialog
                source={getNode(id) as Node}
                open={editOpen}
                setOpen={setEditOpen}
            />
            <Dialog.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
                <Dialog.Content width='50vw' minWidth='300px'>
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
                </Dialog.Content>
            </Dialog.Root>
            <Handle type={'target'} position={Position.Top}/>
            <Handle type={'source'} position={Position.Bottom}/>
        </>
    )
}