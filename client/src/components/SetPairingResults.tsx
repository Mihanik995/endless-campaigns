import {Button, Callout, Flex, Heading, IconButton, Popover, Spinner, Text} from "@radix-ui/themes";
import type {CampaignRegister, Pairing} from "../types.ts";
import {InfoCircledIcon, QuestionMarkIcon} from "@radix-ui/react-icons";
import TextInput from "./TextInput.tsx";
import {useNavigate} from "react-router";
import {useState} from "react";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import {type SubmitHandler, useForm} from "react-hook-form";
import CheckManyInput from "./CheckManyInput.tsx";
import SelectInput from "./SelectInput.tsx";

interface Props {
    pairing: Pairing;
}

interface PairingResults {
    winners: string[]
    reportLink?: string
}

export default function ({pairing}: Props) {
    const {control, handleSubmit} = useForm<PairingResults>({
        defaultValues: {winners: []},
        mode: "onBlur"
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()

    const navigate = useNavigate()
    const onSubmit: SubmitHandler<PairingResults> = (data) => {
        setIsLoading(true)
        axios.post(`/missions/pairings/${pairing.id}/set-winners`, data)
            .then(res => {
                if (res.status === 200) navigate('/dashboard')
            })
            .catch((error) => setError(error as Error))
            .finally(() => setIsLoading(false))
    }


    return isLoading
        ? <Spinner size='3'/>
        : pairing.played
            ? <>
                <Text weight='bold'>This game was already played</Text>
                {pairing.winners.length
                    ? pairing.resultsApproved
                        ? <>
                            <Text>The winner{
                                (pairing as Pairing).winners.length > 1 ? 's' : ''
                            } is:</Text>
                            <Text weight='bold'>
                                {(pairing as Pairing).winners
                                    .map(winner => winner.player?.username)
                                    .join(', ')}
                            </Text>
                        </>
                        : <Text>Pairing results was not approved yet.</Text>
                    : <Text>There was no winner...</Text>}
            </>
            : <Flex justify='center' direction={{
                initial: 'column',
                xs: 'row'
            }} gap='5'>
                {pairing.resultsRejected || !!error &&
                    <Flex direction='column' gap='2'>
                        {pairing.resultsRejected &&
                            <Callout.Root color='red'>
                                <Flex height='100%' align='center' gap='3' maxWidth={{xs: '40vw'}}>
                                    <Callout.Icon>
                                        <InfoCircledIcon/>
                                    </Callout.Icon>
                                    <Flex direction='column'>
                                        <Heading size='3'>
                                            Your previous report was rejected with the message:
                                        </Heading>
                                        <Text size='3'>{pairing.rejectMessage}</Text>
                                    </Flex>
                                </Flex>
                            </Callout.Root>
                        }
                        {!!error && <ErrorHandler error={error}/>}
                    </Flex>
                }
                <Flex direction='column' gap='2'>
                    <Text weight='medium' size='4'>Choose the winner(s):</Text>
                    {pairing.rewardsOnPairings.length
                        ? <SelectInput
                            name="winners.0"
                            control={control}
                            options={pairing.players.reduce((acc, player) => {
                                acc[player.playerId] = player.player.username
                                return acc
                            }, {} as Record<string, string>)}
                        />
                        : <CheckManyInput
                        name="winners"
                        control={control}
                        values={pairing.players.map((player) => {
                            return {
                                value: player.playerId,
                                title: player.player.username,
                                details: (pairing?.campaign?.campaignRegisters
                                    ?.find(reg => reg.playerId === player.playerId) as CampaignRegister)
                                    .formationName
                            }
                        })}
                    />}
                    {pairing.campaign?.requiresPairingReport &&
                        <TextInput
                            label='Report link'
                            name='reportLink'
                            control={control}
                        />
                    }
                    <Flex gap='3' align='center'>
                        <Button size='3' onClick={handleSubmit(onSubmit)}>Submit</Button>
                        <Popover.Root>
                            <Popover.Trigger>
                                <IconButton radius='full' variant='outline'>
                                    <QuestionMarkIcon/>
                                </IconButton>
                            </Popover.Trigger>
                            <Popover.Content>
                                <Text>
                                    If you have no winner, don't select any options, just Submit.
                                </Text>
                            </Popover.Content>
                        </Popover.Root>
                    </Flex>
                </Flex>
            </Flex>
}