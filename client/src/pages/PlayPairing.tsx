import Header from "../components/Header.tsx";
import {type MouseEventHandler, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import type {CampaignRegister, Pairing, PlayersOnPairings, SimpleMission} from "../types.ts";
import axios from "../axios/axiosConfig.ts";
import {useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";
import {
    Button,
    Card,
    CheckboxCards,
    Container,
    Flex,
    IconButton,
    Popover,
    Separator,
    Spinner, Strong,
    Text
} from "@radix-ui/themes";
import ErrorHandler from "../components/ErrorHandler.tsx";
import MissionCard from "../components/MissionCard.tsx";
import {QuestionMarkIcon} from "@radix-ui/react-icons";
import TextInput from "../components/TextInput.tsx";

export default function () {
    const [error, setError] = useState<Error>()
    const id = useParams().id as string
    const auth = useAppSelector(selectAuth)
    const [pairing, setPairing] = useState<Pairing>({
        id: '', campaignId: '', periodId: '', simpleMissionId: '',
        played: false, players: [], winners: [], resultsApproved: false,
        resultsRejected: false,
    })
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        setIsLoading(true)
        axios.get(`/missions/pairings/${id}`)
            .then(res => {
                if (res.status === 200) {
                    setPairing(res.data);
                    if (
                        !res.data.players
                            .map((player: PlayersOnPairings) => player.playerId)
                            .includes(auth.id as string)
                    ) {
                        throw new Error(`You don't participate in that pairing!`)
                    }
                }
            }).catch(error => setError(error as Error))
            .finally(() => setIsLoading(false))
    }, []);

    const [winners, setWinners] = useState<string[]>([])
    const [reportLink, setReportLink] = useState<string>("")
    const handleClick = (value: string) => {
        winners.includes(value)
            ? setWinners(winners.filter(id => id !== value))
            : setWinners([...winners, value]);
    }

    const navigate = useNavigate()
    const handleSubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        axios.post(`/missions/pairings/${id}/set-winners`, {winners, reportLink})
            .then(res => {
                if (res.status === 200) navigate('/dashboard')
            })
    }

    return <>
        <Header/>
        <Container className='pb-5 pt-23'>
            <Flex minHeight='40vh' align='center' justify='center'>
                <Card>
                    {isLoading
                        ? <Spinner size='3' m='4'/>
                        : !!error
                            ? <ErrorHandler error={error}/>
                            : <Flex direction='column' align='center' gap='2'>
                                <MissionCard
                                    clickable={false}
                                    onDelete={() => {
                                    }}
                                    mission={pairing?.simpleMission as SimpleMission}
                                    owner={false}
                                />
                                <Separator size='4' my='2'/>
                                {pairing.played
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
                                    : <Flex justify='center' gap='2'>
                                        {pairing.resultsRejected &&
                                            <Card>
                                                <Text color='red'>
                                                    <Flex
                                                        direction='column'
                                                        justify='center'
                                                        align='center'
                                                        height='100%'
                                                        gap='2'
                                                    >
                                                        <Strong>
                                                            Your previous report was rejected with the message:
                                                        </Strong>
                                                        {pairing.rejectMessage}
                                                    </Flex>
                                                </Text>
                                            </Card>
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
                                            {pairing.campaign?.requiresPairingReport && <TextInput
                                                label='Report link'
                                                name='rosterLink'
                                                value={reportLink}
                                                onChange={
                                                    (e) => setReportLink(e.target.value)
                                                }
                                            />}
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
                                    </Flex>}
                            </Flex>
                    }
                </Card>
            </Flex>
        </Container>
    </>
}