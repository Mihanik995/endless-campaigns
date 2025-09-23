import {Button, Container, Flex, Popover} from "@radix-ui/themes";
import {type ChangeEvent, type MouseEventHandler, type ReactElement, useState} from "react";
import TextInput from "./TextInput.tsx";
import axios from "../axios/axiosConfig.ts";
import type {CampaignRegisterCreate} from "../types.ts";

interface Props {
    campaignId: string
}

export default function ({campaignId}: Props): ReactElement {
    const [registerData, setRegisterData] = useState<CampaignRegisterCreate>({
        campaignId: campaignId,
        formationName: '',
        rosterLink: ''
    })

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRegisterData({
            ...registerData,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmit: MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault()

        axios.post('/campaigns/register', registerData)
            .then((response) => {
                if (response.status === 201) window.location.reload();
            })
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
                        <Popover.Close>
                            <Button onClick={handleSubmit}>Register</Button>
                        </Popover.Close>
                    </Flex>
                </Container>
            </Popover.Content>
        </Popover.Root>
    )
}