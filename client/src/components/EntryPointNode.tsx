import {Card, ContextMenu, Flex, Text} from "@radix-ui/themes";
import {Handle, type Node, type NodeProps, Position, useReactFlow} from "@xyflow/react";
import AddNodeDialog from "./AddNodeDialog.tsx";
import {useState} from "react";

export default function ({id}: NodeProps) {
    const {getNode, getEdge} = useReactFlow();
    const startNodeConn = getEdge('0')
    const [createOpen, setCreateOpen] = useState(false)

    return (<>
            <ContextMenu.Root>
                <ContextMenu.Trigger disabled={!!startNodeConn}>
                    <Card className='nodrag'>
                        <Flex width='160px' justify='center' align='center'>
                            <Text weight='medium'>ENTRYPOINT</Text>
                        </Flex>
                    </Card>
                </ContextMenu.Trigger>
                <ContextMenu.Content>
                    {!startNodeConn &&
                        <ContextMenu.Item onSelect={() => setCreateOpen(true)}>
                            Add start node
                        </ContextMenu.Item>
                    }
                </ContextMenu.Content>
            </ContextMenu.Root>
            <AddNodeDialog
                source={getNode(id) as Node}
                startNode
                open={createOpen}
                setOpen={setCreateOpen}
            />
            <Handle type="source" position={Position.Bottom} isConnectable={false}/>
        </>
    )
}