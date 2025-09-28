import {Button, Callout, CheckboxCards, Flex, Heading, IconButton, Popover, Spinner, Text} from "@radix-ui/themes";
import type {CampaignRegister, Pairing} from "../types.ts";
import {InfoCircledIcon, QuestionMarkIcon} from "@radix-ui/react-icons";
import TextInput from "./TextInput.tsx";
import {useNavigate} from "react-router";
import {type MouseEventHandler, useState} from "react";
import validateString from "../utils/validators/validateString.ts";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "./ErrorHandler.tsx";

interface Props {
    pairing: Pairing;
}

export default function ({pairing}: Props) {
    const [winners, setWinners] = useState<string[]>([])
    const [reportLink, setReportLink] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()

    const handleClick = (value: string) => {
        winners.includes(value)
            ? setWinners(winners.filter(id => id !== value))
            : setWinners([...winners, value]);
    }

    const navigate = useNavigate()
    const handleSubmit: MouseEventHandler<HTMLButtonElement> = () => {
        setIsLoading(true)
        try {
            if (pairing.campaign?.requiresPairingReport) validateString('Report link', reportLink)
            axios.post(`/missions/pairings/${pairing.id}/set-winners`, {winners, reportLink})
                .then(res => {
                    if (res.status === 200) navigate('/dashboard')
                })
        } catch (error) {
            setError(error as Error)
        } finally {
            setIsLoading(false)
        }
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
                    <CheckboxCards.Root
                        defaultValue={winners}
                        columns={{
                            initial: "1",
                            sm: `${(pairing?.players.length as number) < 10
                                ? pairing?.players.length
                                : 10}`
                        }}>
                        {pairing?.players.map(player => (
                            <CheckboxCards.Item
                                key={player.playerId}
                                value={player.playerId}
                                onClick={() => handleClick(player.playerId)}
                            >
                                <Flex direction="column" width="100%">
                                    <Text weight="bold">
                                        {player.player.username}
                                    </Text>
                                    <Text>
                                        {(pairing?.campaign?.campaignRegisters?.find(
                                            reg => reg.playerId === player.playerId
                                        ) as CampaignRegister)
                                            .formationName}

                                    </Text>
                                </Flex>
                            </CheckboxCards.Item>
                        ))}
                    </CheckboxCards.Root>
                    {pairing.campaign?.requiresPairingReport &&
                        <TextInput
                            label='Report link'
                            name='rosterLink'
                            value={reportLink}
                            onChange={
                                (e) => setReportLink(e.target.value)
                            }
                        />
                    }
                    <Flex gap='3' align='center'>
                        <Button size='3' onClick={handleSubmit}>Submit</Button>
                        <Popover.Root>
                            <Popover.Trigger>
                                <IconButton radius='full' variant='outline'>
                                    <QuestionMarkIcon/>
                                </IconButton>
                            </Popover.Trigger>
                            <Popover.Content>
                                <Text>If you have no winner, don't select any options, just
                                    Submit.</Text>
                            </Popover.Content>
                        </Popover.Root>
                    </Flex>
                </Flex>
            </Flex>
}