import {Box, Button, Flex, IconButton, Link, Select, Table, CheckboxGroup, Popover, Text} from "@radix-ui/themes";
import type {CampaignPeriod, Pairing, PlayerRegister, SimpleMission} from "../types.ts";
import {type MouseEventHandler, useState} from "react";
import {CheckIcon, Cross2Icon, PlusIcon} from "@radix-ui/react-icons";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import {useNavigate} from "react-router";
import TextInput from "./TextInput.tsx";

interface Props {
    pairing: Pairing
    isOwner: boolean
    missions: SimpleMission[]
    playerRegisters: PlayerRegister[]
    period: CampaignPeriod
    onChange: () => void
}

export default function ({pairing, isOwner, missions, playerRegisters, period, onChange}: Props) {
    const [edit, setEdit] = useState(false);
    const [mission, setMission] = useState<SimpleMission>(pairing.simpleMission as SimpleMission)
    const [playersList, setPlayersList] = useState<PlayerRegister[]>(
        playerRegisters.filter(pr => pairing.players.map(p => p.player.id).includes(pr.playerId))
    )
    const [playersOptions, setPlayersOptions] = useState<PlayerRegister[]>(
        playerRegisters.filter(pr => !playersList.map(p => p.playerId).includes(pr.playerId))
    )
    const [addPlayer, setAddPlayer] = useState(false)
    const [playerToAdd, setPlayerToAdd] = useState('')
    const [winners, setWinners] = useState<string[]>([])

    const [error, setError] = useState<Error>()
    const navigate = useNavigate()

    const handleAdd = () => {
        if (addPlayer && playerToAdd.length) {
            const newPlayer = JSON.parse(playerToAdd) as PlayerRegister
            setPlayersList([...playersList, newPlayer])
            setPlayersOptions(playersOptions.filter(player => player.id !== newPlayer.id))
        }
        setPlayerToAdd('')
        setAddPlayer(!addPlayer)
    }

    const handleDelete = (id: string) => {
        setPlayersList(playersList.filter(player => player.id !== id))
        setPlayersOptions([
            ...playersOptions,
            playerRegisters.find(player => player.id === id) as PlayerRegister
        ])
    }

    const handleSubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()

        axios.put(`/missions/pairings/${pairing.id}`, {
            campaignId: period.campaignId,
            periodId: period.id,
            simpleMissionId: mission.id,
            playerIds: playersList.map(player => player.playerId),
            winners
        }).then(res => {
            if (res.status === 200) onChange()
        }).catch(err => setError(err as Error))
    }

    const handleDeletePairing: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();

        axios.delete(`/missions/pairings/${pairing.id}`)
            .then(res => {
                if (res.status === 204) onChange()
            }).catch(err => setError(err as Error));
    }

    const handleWinnerClick = (value: string) => {
        winners.includes(value)
            ? setWinners(winners.filter(item => item !== value))
            : setWinners([...winners, value])
    }

    const approveResults: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        axios.put(`/missions/pairings/${pairing.id}/approve`)
            .then(res => {
                if (res.status === 200) onChange()
            }).catch(err => setError(err as Error))
    }

    const [rejectMessage, setRejectMessage] = useState('')
    const rejectResults: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        axios.put(`/missions/pairings/${pairing.id}/reject`, {rejectMessage})
            .then(res => {
                if (res.status === 200) onChange()
            }).catch(err => setError(err as Error))
    }

    return (
        <>
            <Table.Row>
                {edit
                    ? <>
                        <Table.Cell colSpan={3}>
                            <Flex direction='column' gap='2'>
                                <Select.Root
                                    defaultValue={JSON.stringify(mission)}
                                    onValueChange={(value) => setMission(JSON.parse(value))}
                                >
                                    <Select.Trigger placeholder='Choose mission'/>
                                    <Select.Content>
                                        {missions.map((mission) => (
                                            <Select.Item key={mission.id} value={JSON.stringify(mission)}>
                                                {mission.title}
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Root>
                                <Flex gap='2' align='center'>
                                    Players:
                                    {playersList.map((player: PlayerRegister) => (
                                        <Flex gap='1' align='center' key={player.id}>
                                            {player.playerUsername}
                                            <IconButton
                                                color='red'
                                                size='1'
                                                radius='full'
                                                onClick={() => handleDelete(player.id)}
                                            >
                                                <Cross2Icon/>
                                            </IconButton>
                                        </Flex>
                                    ))}
                                    {!!playersOptions.length && <Box>
                                        <IconButton
                                            onClick={handleAdd}
                                            color={addPlayer && playerToAdd.length ? 'grass' : undefined}
                                        >
                                            {addPlayer
                                                ? playerToAdd.length
                                                    ? <CheckIcon/>
                                                    : <Cross2Icon/>
                                                : <PlusIcon/>
                                            }
                                        </IconButton>
                                        {addPlayer && <Select.Root defaultValue='' onValueChange={setPlayerToAdd}>
                                            <Select.Trigger placeholder='Choose a player'/>
                                            <Select.Content>
                                                {playersOptions.map((player: PlayerRegister) => (
                                                    <Select.Item key={player.id} value={JSON.stringify(player)}>
                                                        {player.playerUsername}
                                                    </Select.Item>
                                                ))}
                                            </Select.Content>
                                        </Select.Root>}
                                    </Box>}
                                </Flex>
                                <Flex gap='2' align='center'>
                                    Winners:
                                    <CheckboxGroup.Root>
                                        {playersList.map(player => (
                                            <CheckboxGroup.Item
                                                key={player.playerId}
                                                value={player.playerId}
                                                onClick={() => handleWinnerClick(player.playerId)}
                                            >
                                                {player.playerUsername}
                                            </CheckboxGroup.Item>
                                        ))}
                                    </CheckboxGroup.Root>
                                </Flex>
                            </Flex>
                        </Table.Cell>
                        <Table.Cell>
                            <Flex gap='3'>
                                <Button onClick={() => setEdit(false)}>Cancel</Button>
                                <Button color='grass' onClick={handleSubmit}>Submit</Button>
                            </Flex>
                        </Table.Cell>
                    </>
                    : <>
                        <Table.Cell>
                            <Link
                                href=''
                                onClick={() => navigate(`/missions/${pairing.simpleMission?.id}`)}
                            >
                                {pairing.simpleMission?.title}
                            </Link>
                        </Table.Cell>
                        <Table.Cell>
                            <Text align='center'>
                                {pairing.players
                                    .map(player => player.player.username)
                                    .join(' / ')
                                }
                            </Text>
                        </Table.Cell>
                        <Table.Cell>
                            {pairing.played
                                ? pairing.winners.length
                                    ? pairing.winners.map(winner => winner.player?.username).join(', ')
                                    : 'No winners'
                                : 'Not played yet'}
                        </Table.Cell>
                        <Table.Cell>
                            {pairing.reportLink
                                ? <Link href={pairing.reportLink} target='_blank'>
                                    {pairing.reportLink}
                                </Link>
                                : '-'}
                        </Table.Cell>
                        {isOwner &&
                            <Table.Cell>
                                <Flex gap='3'>
                                    {!pairing.resultsApproved &&
                                        <>
                                            <Button onClick={approveResults}>Approve results</Button>
                                            <Popover.Root>
                                                <Popover.Trigger>
                                                    <Button>Reject results</Button>
                                                </Popover.Trigger>
                                                <Popover.Content>
                                                    <Flex direction='column' gap='2'>
                                                        <TextInput
                                                            label={'Reject message'}
                                                            name={'rejectMessage'}
                                                            value={rejectMessage}
                                                            onChange={(e) => {
                                                                setRejectMessage(e.target.value)
                                                            }}
                                                        />
                                                        <Popover.Close>
                                                            <Button>Cancel</Button>
                                                        </Popover.Close>
                                                        <Popover.Close>
                                                            <Button onClick={rejectResults} color='red'>Submit</Button>
                                                        </Popover.Close>
                                                    </Flex>
                                                </Popover.Content>
                                            </Popover.Root>
                                        </>}
                                    <Button onClick={() => setEdit(true)}>Edit</Button>
                                    <Button color='red' onClick={handleDeletePairing}>Delete</Button>
                                </Flex>
                            </Table.Cell>
                        }
                    </>
                }
            </Table.Row>
            {!!error && <Table.Row>
                <Table.Cell colSpan={isOwner ? 3 : 2}>
                    <ErrorHandler error={error}/>
                </Table.Cell>
            </Table.Row>}
        </>
    )
}