import {Button, Dialog, Flex, Spinner, Strong, Text} from "@radix-ui/themes";
import axios from "../axios/axiosConfig";
import {type MouseEventHandler, useState} from "react";
import ErrorHandler from "./ErrorHandler.tsx";

interface Props {
    open: boolean
    setOpen: (open: boolean) => void
    groupId: string;
    onDelete: () => void;
}

export default function ({open, setOpen, groupId, onDelete}: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()
    const onSubmit: MouseEventHandler<HTMLButtonElement> = () => {
        setIsLoading(true)
        axios.delete(`/campaigns/assets/group/${groupId}`)
            .then((res) => {
                if (res.status === 204) {
                    onDelete()
                    setOpen(false)
                    setError(undefined)
                }
            }).catch((err) => setError(err))
            .finally(() => setIsLoading(false))
    }

    return <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content aria-describedby={undefined}>
            <Dialog.Title>New Asset</Dialog.Title>
            <Flex direction="column" gap="2">
                <Text>
                    <Strong>NOTICE!</Strong> All the assets bonded with this group
                    will be lost!
                </Text>
                <Flex gap="2">
                    <Button
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onSubmit}
                        disabled={isLoading}
                        color="red"
                    >
                        {isLoading
                            ? <Spinner size="1"/>
                            : 'Submit'
                        }
                    </Button>
                </Flex>
                {!!error && <ErrorHandler error={error}/>}
            </Flex>
        </Dialog.Content>
    </Dialog.Root>
}