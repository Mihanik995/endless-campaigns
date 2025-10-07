import {Box, Button, CheckboxGroup, ContextMenu, Flex, IconButton, Link, Table, Text} from "@radix-ui/themes";
import type {CampaignPeriod, Mission, Pairing, PlayerRegister} from "../types.ts";
import {type MouseEventHandler, useState} from "react";
import {CheckIcon, Cross2Icon, PlusIcon} from "@radix-ui/react-icons";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import {useNavigate} from "react-router";
import RejectPairingResultsDialog from "./RejectPairingResultsDialog.tsx";
import CheckPassedNodesDialog from "./CheckPassedNodesDialog.tsx";
import SelectInput from "./SelectInput.tsx";

interface Props {
    pairing: Pairing
    missions: Mission[]
    playerRegisters: PlayerRegister[]
    period: CampaignPeriod
    onChange: () => void
}

export default function ({pairing, missions, playerRegisters, period, onChange}: Props) {
    const [edit, setEdit] = useState(false);
    const [mission, setMission] = useState<Mission>(pairing.simpleMission as Mission)
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

    const handleSubmit: MouseEventHandler<HTMLButtonElement> = () => {
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

    const handleDeletePairing = (): void => {
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

    const approveResults = (): void => {
        axios.put(`/missions/pairings/${pairing.id}/approve`)
            .then(res => {
                if (res.status === 200) onChange()
            }).catch(err => setError(err as Error))
    }

    const [rejectOpen, setRejectOpen] = useState(false)
    const [nodesOpen, setNodesOpen] = useState(false)

    return <>
        <Table.Row>
            {edit
                ? <>
                    <Table.Cell colSpan={3}>
                        <Flex direction='column' gap='2'>
                            <SelectInput
                                value={JSON.stringify(mission)}
                                onValueChange={(value) => setMission(JSON.parse(value))}
                                placeholder='Choose mission'
                                options={missions.reduce((acc, mission) => {
                                    acc[mission.id] = JSON.stringify(mission)
                                    return acc
                                }, {} as Record<string, string>)}
                            />
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
                                    {addPlayer &&
                                        <SelectInput
                                            value={JSON.stringify(playerToAdd)}
                                            onValueChange={setPlayerToAdd}
                                            options={playersOptions.reduce((acc, player) => {
                                                acc[player.id] = JSON.stringify(player)
                                                return acc
                                            }, {} as Record<string, string>)}
                                            placeholder='Choose a player'
                                        />
                                    }
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
                    <Table.Cell minWidth='150px'>
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
                                {pairing.reportLink.length > 20
                                    ? `${pairing.reportLink.slice(0, 20)}...`
                                    : pairing.reportLink}
                            </Link>
                            : '-'}
                    </Table.Cell>
                    <ContextMenu.Root>
                        <ContextMenu.Trigger>
                            <Table.Cell>
                                <Button>Right-click / Hold</Button>
                            </Table.Cell>
                        </ContextMenu.Trigger>
                        <ContextMenu.Content>
                            {pairing.played && !pairing.resultsApproved && <>
                                <ContextMenu.Item onSelect={approveResults}>
                                    Approve results
                                </ContextMenu.Item>
                                <ContextMenu.Item onSelect={() => setRejectOpen(true)}>
                                    Reject results
                                </ContextMenu.Item>
                                <ContextMenu.Separator/>
                            </>}
                            {pairing.mission?.nodes &&
                                <>
                                    <ContextMenu.Item onSelect={() => setNodesOpen(true)}>
                                        Check nodes passed
                                    </ContextMenu.Item>
                                    <ContextMenu.Separator/>
                                </>
                            }
                            <ContextMenu.Item onSelect={() => setEdit(true)}>
                                Edit
                            </ContextMenu.Item>
                            <ContextMenu.Item color='red' onSelect={handleDeletePairing}>
                                Delete
                            </ContextMenu.Item>
                        </ContextMenu.Content>
                    </ContextMenu.Root>
                </>
            }
        </Table.Row>
        {
            !!error && <Table.Row>
                <Table.Cell colSpan={3}>
                    <ErrorHandler error={error}/>
                </Table.Cell>
            </Table.Row>
        }
        <RejectPairingResultsDialog
            open={rejectOpen}
            setOpen={setRejectOpen}
            pairing={pairing}
            onChange={onChange}
        />
        <CheckPassedNodesDialog
            open={nodesOpen}
            setOpen={setNodesOpen}
            pairing={pairing}
            onChange={onChange}
        />
    </>
}