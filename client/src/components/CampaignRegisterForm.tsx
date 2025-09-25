import {Button, Container, Flex, Popover} from "@radix-ui/themes";
import {type ChangeEvent, type MouseEventHandler, type ReactElement, useState} from "react";
import TextInput from "./TextInput.tsx";
import axios from "../axios/axiosConfig.ts";
import type {CampaignRegisterCreate} from "../types.ts";
import validateData from "../utils/validators/validateData.ts";
import ErrorHandler from "./ErrorHandler.tsx";

interface Props {
    campaignId: string
}

export default function ({campaignId}: Props): ReactElement {
    const [registerData, setRegisterData] = useState<CampaignRegisterCreate>({
        campaignId: campaignId,
        formationName: '',
        rosterLink: ''
    })
    const [error, setError] = useState<Error>()

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRegisterData({
            ...registerData,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmit: MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault()

        try {
            validateData<CampaignRegisterCreate>(registerData)
            axios.post('/campaigns/register', registerData)
                .then((response) => {
                    if (response.status === 201) window.location.reload();
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
            <Popover.Content>
                <Container minWidth='300px' width='40vw'>
                    <Flex direction="column" gap='3'>
                        <TextInput
                            label='Formation Name'
                            name='formationName'
                            value={registerData.formationName}
                            onChange={handleChange}
                            placeholder='Name of your gang / squad / army / whatever...'
                        />
                        <TextInput
                            label='Roster Link'
                            name='rosterLink'
                            value={registerData.rosterLink}
                            onChange={handleChange}
                        />
                        {!!error && <ErrorHandler error={error}/>}
                        <Flex gap='3'>
                            <Popover.Close>
                                <Button>Cancel</Button>
                            </Popover.Close>
                            <Popover.Close>
                                <Button onClick={handleSubmit} color='grass'>Register</Button>
                            </Popover.Close>
                        </Flex>
                    </Flex>
                </Container>
            </Popover.Content>
        </Popover.Root>
    )
}