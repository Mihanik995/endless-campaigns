import {Button, Container, Flex, Heading} from "@radix-ui/themes";
import {type ChangeEvent, type MouseEventHandler, type ReactElement, useState} from "react";
import TextInput from "./TextInput.tsx";
import axios from "../axios/axiosConfig.ts";

interface RegisterData {
    campaignId: string;
    formationName: string,
    rosterLink: string
}

interface Props {
    campaignId: string
}

export default function ({campaignId}: Props): ReactElement {
    const [success, setSuccess] = useState(false);
    const [registerData, setRegisterData] = useState<RegisterData>({
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
                if (response.status === 201) setSuccess(true)
            })
    }

    return <Container>
        <Flex direction="column" gap='3'>
            {success
                ? <Heading>You've registered successfully</Heading>
                : <>
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
                    <Button onClick={handleSubmit}>Register</Button>
                </>
            }
        </Flex>
    </Container>
}