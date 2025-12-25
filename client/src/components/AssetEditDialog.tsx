import type {CampaignAsset, CampaignAssetCreate, CampaignRegister} from "../types.ts";
import {Button, Dialog, Flex, IconButton, Spinner, Text} from "@radix-ui/themes";
import {type SubmitHandler, useForm} from "react-hook-form";
import {useState} from "react";
import axios from "../axios/axiosConfig.ts";
import TextInput from "./TextInput.tsx";
import WYSIWYGInput from "./WYSIWYGInput.tsx";
import ErrorHandler from "./ErrorHandler.tsx";
import {Cross2Icon} from "@radix-ui/react-icons";
import SelectInput from "./SelectInput.tsx";

interface Props {
    open: boolean
    setOpen: (open: boolean) => void
    asset: CampaignAsset
    registers: CampaignRegister[]
    onEdit: (asset: CampaignAsset) => void
}

export default function ({open, setOpen, asset, registers, onEdit}: Props) {
    const {control, handleSubmit, watch, setValue} = useForm<CampaignAssetCreate>({
        defaultValues: {
            title: asset.title,
            description: asset.description,
            ownerId: asset.ownerId
        },
        mode: "onBlur"
    })

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()
    const onSubmit: SubmitHandler<CampaignAssetCreate> = (data) => {
        setIsLoading(true)
        axios.put<CampaignAsset>(`/campaigns/assets/${asset.id}`, data)
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
            <Flex direction="column" gap="2">
                <TextInput
                    name="title"
                    control={control}
                    label="Title"
                />
                <WYSIWYGInput
                    name="description"
                    control={control}
                    label="Description"
                />
                {watch('ownerId')
                    ? <Flex gap="2">
                        <IconButton
                            color="red"
                            size="1"
                            onClick={() => setValue('ownerId', null)}
                        >
                            <Cross2Icon/>
                        </IconButton>
                        <Text>
                            {registers.find(reg => reg.id === watch('ownerId'))?.player?.username}
                            {' '}({registers.find(reg => reg.id === watch('ownerId'))?.formationName})
                        </Text>
                    </Flex>
                    : <SelectInput
                        control={control}
                        name={'ownerId'}
                        options={registers.reduce((acc, reg) => {
                            acc[reg.id] = `${reg.player?.username} (${reg.formationName})`
                            return acc
                        }, {} as Record<string, string>)}
                        required={false}
                    />
                }
                {!!error && <ErrorHandler error={error}/>}
                <Flex gap="2">
                    <Button
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        disabled={isLoading}
                        color="grass"
                    >
                        {isLoading
                            ? <Spinner size="1"/>
                            : 'Submit'
                        }
                    </Button>
                </Flex>
            </Flex>
        </Dialog.Content>
    </Dialog.Root>
}