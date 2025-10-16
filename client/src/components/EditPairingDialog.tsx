import {Box, Button, CheckboxGroup, Dialog, Flex, IconButton, Strong, Text} from "@radix-ui/themes";
import SelectInput from "./SelectInput.tsx";
import type {CampaignPeriod, Mission, Pairing, PlayerRegister} from "../types.ts";
import {CheckIcon, Cross2Icon, PlusIcon} from "@radix-ui/react-icons";
import axios from "../axios/axiosConfig.ts";
import {type MouseEventHandler, useState} from "react";
import NewPairingPlayer from "./NewPairingPlayer.tsx";

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    missions: Mission[]
    playerRegisters: PlayerRegister[]
    period: CampaignPeriod
    pairing: Pairing
    onChange: () => void
    onError: (error: Error) => void
}

export default function ({open, onOpenChange, missions, playerRegisters, period, pairing, onChange, onError}: Props) {
    const [missionId, setMissionId] = useState<string>(pairing.missionId)
    const [playersList, setPlayersList] = useState<PlayerRegister[]>(
        pairing.players.map(player => {
            return {
                id: playerRegisters.find(reg => reg.playerId === player.playerId)?.id,
                playerId: player.playerId,
                playerUsername: player.player.username,
                personalMissionId: player.personalMissionId
            } as PlayerRegister
        })
    )
    const [playersOptions, setPlayersOptions] = useState<PlayerRegister[]>(
        playerRegisters.filter(pr => !playersList.map(p => p.playerId).includes(pr.playerId))
    )
    const [addPlayer, setAddPlayer] = useState(false)
    const [playerToAdd, setPlayerToAdd] = useState('')
    const [winners, setWinners] = useState<string[]>([])

    const handleWinnerClick = (value: string) => {
        winners.includes(value)
            ? setWinners(winners.filter(item => item !== value))
            : setWinners([...winners, value])
    }

    const handleAdd = () => {
        if (addPlayer && playerToAdd.length) {
            const newPlayer = JSON.parse(playerToAdd) as PlayerRegister
            setPlayersList([...playersList, newPlayer])
            setPlayersOptions(playersOptions.filter(player => player.id !== newPlayer.id))
        }
        setPlayerToAdd('')
        setAddPlayer(!addPlayer)
    }

    const handleSetCustomMission = (playerId: string, missionId?: string) => {
        setPlayersList(playersList.map(player => player.playerId === playerId
            ? {...player, personalMissionId: missionId}
            : player))
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
            missionId: missionId,
            players: playersList.map(player => {
                return {
                    playerId: player.playerId,
                    personalMissionId: player.personalMissionId,
                }
            }),
            winners
        }).then(res => {
            if (res.status === 200) {
                onChange()
                onOpenChange(false)
            }
        }).catch(err => onError(err as Error))

    }

    return <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Content>
            <Dialog.Title>Edit Pairing</Dialog.Title>
            <Dialog.Description>
                <Text color='red'><Strong>NOTICE!</Strong></Text> Any changes will
                drop players' mission progress (if any).
            </Dialog.Description>
            <Flex direction='column' gap='2' mt='3'>
                <SelectInput
                    size='2'
                    placeholder={'Choose a mission'}
                    value={missionId}
                    onValueChange={setMissionId}
                    options={missions.reduce((acc, mission) => {
                        acc[mission.id] = mission.title
                        return acc
                    }, {} as Record<string, string>)}
                />
                <Flex gap='2' direction='column'>
                    Players:
                    {playersList.map((player: PlayerRegister) => (
                        <NewPairingPlayer
                            key={player.id}
                            player={player}
                            handleDelete={handleDelete}
                            missions={missions}
                            setCustomMission={handleSetCustomMission}
                        />
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
                <Flex gap='3'>
                    <Dialog.Close>
                        <Button>Cancel</Button>
                    </Dialog.Close>
                    <Button color='grass' onClick={handleSubmit}>Submit</Button>
                </Flex>
            </Flex>
        </Dialog.Content>
    </Dialog.Root>
}