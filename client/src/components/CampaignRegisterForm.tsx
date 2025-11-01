import {Button, Container, Flex, Popover} from "@radix-ui/themes";
import {type ReactElement, useState} from "react";
import TextInput from "./TextInput.tsx";
import axios from "../axios/axiosConfig.ts";
import type {CampaignRegister, CampaignRegisterCreate} from "../types.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import {type SubmitHandler, useForm} from "react-hook-form";

interface Props {
    campaignId: string
    onEdit: (newReg: CampaignRegister) => void
}

export default function ({campaignId, onEdit}: Props): ReactElement {
    const {control, handleSubmit} = useForm<CampaignRegisterCreate>({
        defaultValues: {campaignId},
        mode: "onBlur"
    })
    const [error, setError] = useState<Error>()

    const onSubmit: SubmitHandler<CampaignRegisterCreate> = (data) => {
        try {
            axios.post<CampaignRegister>('/campaigns/register', data)
                .then((response) => {
                    if (response.status === 201) onEdit(response.data)
                })
        } catch (error) {
            setError(error as Error)
        }
    }

    return (
        <Popover.Root>
            <Popover.Trigger>
                <Button>Register Form</Button>
            </Popover.Trigger>
            <Popover.Content minWidth='300px' width='40vw'>
                <Container>
                    <Flex direction="column" gap='3'>
                        <TextInput
                            label='Formation Name'
                            name='formationName'
                            control={control}
                            placeholder='Name of your gang / squad / army / whatever...'
                        />
                        <TextInput
                            label='Roster Link'
                            name='rosterLink'
                            control={control}
                        />
                        {!!error && <ErrorHandler error={error}/>}
                        <Flex gap='3'>
                            <Popover.Close>
                                <Button>Cancel</Button>
                            </Popover.Close>
                            <Popover.Close>
                                <Button onClick={handleSubmit(onSubmit)} color='grass'>Register</Button>
                            </Popover.Close>
                        </Flex>
                    </Flex>
                </Container>
            </Popover.Content>
        </Popover.Root>
    )
}