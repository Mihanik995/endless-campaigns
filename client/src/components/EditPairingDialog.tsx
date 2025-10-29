import {Button, Dialog, Flex, IconButton, Strong, Text} from "@radix-ui/themes";
import SelectInput from "./SelectInput.tsx";
import type {CampaignPeriod, Mission, Pairing, PlayerRegister} from "../types.ts";
import {PlusIcon} from "@radix-ui/react-icons";
import axios from "../axios/axiosConfig.ts";
import {useState} from "react";
import NewPairingPlayer from "./NewPairingPlayer.tsx";
import AddPlayerToPairing from "./AddPlayerToPairing.tsx";
import {type SubmitHandler, useForm} from "react-hook-form";
import CheckManyInput from "./CheckManyInput.tsx";

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

interface PairingMissionAndWinners {
    missionId: string
    winners: string[]
}

export default function ({open, onOpenChange, missions, playerRegisters, pairing, onChange, onError}: Props) {
    const [playersList, setPlayersList] = useState<PlayerRegister[]>(
        pairing.players.map(player => {
            return {
                playerUsername: player.player.username,
                playerId: player.playerId,
                personalMissionId: player.personalMissionId
            } as PlayerRegister
        }))
    const {control, handleSubmit} = useForm<PairingMissionAndWinners>({
        defaultValues: {
            missionId: pairing.missionId,
            winners: pairing.winners.map(winner => winner.playerId as string)
        }
    })

    const [playersOptions, setPlayersOptions] = useState<PlayerRegister[]>(
        playerRegisters.filter(pr => !playersList
            .map(p => p.playerId).includes(pr.playerId))
    )
    const [addPlayer, setAddPlayer] = useState(false)
    const [playerToAdd, setPlayerToAdd] = useState('')

    const handleAdd = () => {
        if (addPlayer && playerToAdd.length) {
            setPlayersList([
                ...playersList,
                playerRegisters.find(player => player.playerId === playerToAdd) as PlayerRegister
            ])
            setPlayersOptions(playersOptions.filter(player => player.playerId !== playerToAdd))
        }
        setPlayerToAdd('')
        setAddPlayer(!addPlayer)
    }

    const handleSetCustomMission = (playerId: string, missionId?: string) => {
        setPlayersList(playersList
            .map(player => player.playerId === playerId
                ? {...player, personalMissionId: missionId}
                : player))
    }

    const handleDelete = (id: string) => {
        setPlayersList(playersList
            .filter(player => player.playerId !== id))
        setPlayersOptions([
            ...playersOptions,
            playerRegisters.find(player => player.playerId === id) as PlayerRegister
        ])
    }

    const onSubmit: SubmitHandler<PairingMissionAndWinners> = (data) => {
        axios.put(`/missions/pairings/${pairing.id}`, {
            campaignId: pairing.campaignId,
            periodId: pairing.periodId,
            players: playersList.map(player => {
                return {
                    playerId: player.playerId,
                    personalMissionId: player.personalMissionId,
                }
            }),
            ...data
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
                    placeholder='Choose a mission'
                    name='missionId'
                    control={control}
                    options={missions.reduce((acc, mission) => {
                        acc[mission.id] = mission.title
                        return acc
                    }, {} as Record<string, string>)}
                />
                <Flex gap='2' direction='column'>
                    Players:
                    {playersList
                        .map((player: PlayerRegister) => (
                            <NewPairingPlayer
                                key={player.playerId}
                                player={player}
                                handleDelete={handleDelete}
                                missions={missions}
                                setCustomMission={handleSetCustomMission}
                            />
                        ))}
                    {!!playersOptions.length && <Flex gap='1' align='center'>
                        {addPlayer
                            ? <AddPlayerToPairing
                                playersOptions={playersOptions}
                                handleAdd={handleAdd}
                                setPlayerToAdd={setPlayerToAdd}
                            />
                            : <IconButton
                                size='1'
                                onClick={handleAdd}
                                color='grass'
                            >
                                <PlusIcon/>
                            </IconButton>}
                    </Flex>}
                </Flex>
                <Flex gap='2' align='center'>
                    Winners:
                    <CheckManyInput
                        name='winners'
                        control={control}
                        values={playersList.map((player) => {
                            return {
                                value: player.playerId,
                                title: player.playerUsername
                            }
                        })}
                    />
                </Flex>
                <Flex gap='3'>
                    <Dialog.Close>
                        <Button>Cancel</Button>
                    </Dialog.Close>
                    <Button color='grass' onClick={handleSubmit(onSubmit)}>Submit</Button>
                </Flex>
            </Flex>
        </Dialog.Content>
    </Dialog.Root>
}