import type {CampaignAsset, CampaignAssetCreate} from "../types.ts";
import {Dialog} from "@radix-ui/themes";
import {type SubmitHandler, useForm} from "react-hook-form";
import {useState} from "react";
import axios from "../axios/axiosConfig.ts";
import {Button, Flex, Spinner} from "@radix-ui/themes";
import TextInput from "./TextInput.tsx";
import WYSIWYGInput from "./WYSIWYGInput.tsx";
import ErrorHandler from "./ErrorHandler.tsx";

interface Props {
    open: boolean
    setOpen: (open: boolean) => void
    asset: CampaignAsset
    onEdit: (asset: CampaignAsset) => void
}

export default function ({open, setOpen, asset, onEdit}: Props) {
    const {control, handleSubmit} = useForm<CampaignAssetCreate>({
        defaultValues: {
            title: asset.title,
            description: asset.description,
            groupId: asset.groupId
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
            <Flex direction='column' gap='2'>
                <TextInput
                    name='title'
                    control={control}
                    label='Title'
                />
                <WYSIWYGInput
                    name='description'
                    control={control}
                    label='Description'
                />
                {!!error && <ErrorHandler error={error}/>}
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
            </Flex>
        </Dialog.Content>
    </Dialog.Root>
}