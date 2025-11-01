import {Button, Dialog, Flex, Spinner} from "@radix-ui/themes";
import TextInput from "./TextInput.tsx";
import {useState} from "react";
import axios from "../axios/axiosConfig.ts";
import type {Pairing} from "../types.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import {type SubmitHandler, useForm} from "react-hook-form";

interface Props {
    open: boolean
    setOpen: (open: boolean) => void
    pairing: Pairing
    onEdit: (pairing: Pairing) => void
}

interface RejectMessage{
    rejectMessage: string
}

export default function ({open, setOpen, pairing, onEdit}: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()
    const {control, handleSubmit} = useForm<RejectMessage>({
        mode: "onBlur"
    })
    const onRejectResults: SubmitHandler<RejectMessage> = (data) => {
        setIsLoading(true)
        axios.put<Pairing>(`/missions/pairings/${pairing.id}/reject`, data)
            .then(res => {
                if (res.status === 200) {
                    onEdit(res.data)
                    setError(undefined)
                }
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
                                    control={control}
                                />
                                <Dialog.Close>
                                    <Button>Cancel</Button>
                                </Dialog.Close>
                                <Dialog.Close>
                                    <Button onClick={handleSubmit(onRejectResults)}
                                            color='red'>Submit</Button>
                                </Dialog.Close>
                            </Flex>
                        </>}
            </Dialog.Content>
        </Dialog.Root>
    )
}