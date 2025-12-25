import type {AssetGroup} from "../types.ts";
import {Button, Dialog, Flex, Spinner} from "@radix-ui/themes";
import TextInput from "./TextInput.tsx";
import {type SubmitHandler, useForm} from "react-hook-form";
import axios from "../axios/axiosConfig";
import {useState} from "react";
import ErrorHandler from "./ErrorHandler.tsx";

interface Props {
    open: boolean
    setOpen: (open: boolean) => void
    group: AssetGroup;
    onEdit: (group: AssetGroup) => void;
}

export default function ({open, setOpen, group, onEdit}: Props) {
    const {control, handleSubmit} = useForm<{groupTitle: string}>({
        defaultValues: {groupTitle: group.groupTitle},
        mode: "onBlur"
    })

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()
    const onSubmit: SubmitHandler<{groupTitle: string}> = (data) => {
        setIsLoading(true)
        axios.put<AssetGroup>(`/campaigns/assets/group/${group.id}`, data)
            .then((res) => {
                if (res.status === 200) {
                    onEdit(res.data)
                    setOpen(false)
                    setError(undefined)
                }
            }).catch((err) => setError(err))
            .finally(() => setIsLoading(false))
    }

    return <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content aria-describedby={undefined}>
            <Dialog.Title>New Asset</Dialog.Title>
            <Flex justify='between' align='center'>
                <TextInput
                    name='groupTitle'
                    control={control}
                />
                <Flex gap='2'>
                    <Button
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        disabled={isLoading}
                        color='grass'
                    >
                        {isLoading
                            ? <Spinner size='1'/>
                            : 'Submit'
                        }
                    </Button>
                </Flex>
                {!!error && <ErrorHandler error={error}/>}
            </Flex>
        </Dialog.Content>
    </Dialog.Root>
}