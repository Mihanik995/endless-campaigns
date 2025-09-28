import {Dialog} from "@radix-ui/themes";
import {Button, Flex, Spinner} from "@radix-ui/themes";
import TextInput from "./TextInput.tsx";
import {type MouseEventHandler, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import type {Pairing} from "../types.ts";
import ErrorHandler from "./ErrorHandler.tsx";

interface Props {
    open: boolean
    setOpen: (open: boolean) => void
    pairing: Pairing
    onChange: () => void
}

export default function ({open, setOpen, pairing, onChange}: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()
    const [rejectMessage, setRejectMessage] = useState('')
    const rejectResults: MouseEventHandler<HTMLButtonElement> = () => {
        setIsLoading(true)
        axios.put(`/missions/pairings/${pairing.id}/reject`, {rejectMessage})
            .then(res => {
                if (res.status === 200) onChange()
            }).catch(err => setError(err as Error))
            .finally(() => setIsLoading(false))
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Content width='50vw' minWidth='300px'>
                {isLoading
                    ? <Flex justify='center'><Spinner size='3'/></Flex>
                    : !!error
                        ? <Flex justify='center'><ErrorHandler error={error}/></Flex>
                        : <>
                            <Dialog.Title/>
                            <Dialog.Description/>
                            <Flex direction='column' gap='2'>
                                <TextInput
                                    label={'Reject message'}
                                    name={'rejectMessage'}
                                    value={rejectMessage}
                                    onChange={(e) => {
                                        setRejectMessage(e.target.value)
                                    }}
                                />
                                <Dialog.Close>
                                    <Button>Cancel</Button>
                                </Dialog.Close>
                                <Dialog.Close>
                                    <Button onClick={rejectResults}
                                            color='red'>Submit</Button>
                                </Dialog.Close>
                            </Flex>
                        </>}
            </Dialog.Content>
        </Dialog.Root>
    )
}