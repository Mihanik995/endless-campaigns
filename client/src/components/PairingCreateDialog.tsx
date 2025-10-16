import {Button, Dialog, Flex, IconButton, Text} from "@radix-ui/themes";
import {type MouseEventHandler, useState} from "react";
import {CheckIcon, Cross2Icon, PlusIcon} from "@radix-ui/react-icons";
import axios from "../axios/axiosConfig.ts";
import type {CampaignPeriod, Mission, PairingCreate, PlayerRegister} from "../types.ts";
import validateData from "../utils/validators/validateData.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import SelectInput from "./SelectInput.tsx";
import NewPairingPlayer from "./NewPairingPlayer.tsx";

interface Props {
    open: boolean;
    openChange: (open: boolean) => void;
    playerRegisters: PlayerRegister[],
    missions: Mission[],
    period: CampaignPeriod
    onChange: () => void
}

export default function ({playerRegisters, period, onChange, missions, open, openChange}: Props) {
    const [playersList, setPlayersList] = useState<PlayerRegister[]>([])
    const [playersOptions, setPlayersOptions] = useState<PlayerRegister[]>(playerRegisters)
    const [mission, setMission] = useState<Mission>()

    const [addPlayer, setAddPlayer] = useState(false)
    const [playerToAdd, setPlayerToAdd] = useState('')

    const handleAdd = () => {
        if (addPlayer && playerToAdd.length) {
            const newPlayer = JSON.parse(playerToAdd) as PlayerRegister
            setPlayersList([...playersList, newPlayer])
            setPlayersOptions(playersOptions.filter(player => player.id !== newPlayer.id))
        }
        setPlayerToAdd('')
        setAddPlayer(!addPlayer)
    }

    const handleAddCustomMission = (playerId: string, missionId?: string) => {
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

    const [error, setError] = useState<Error>()
    const handleSubmit: MouseEventHandler<HTMLButtonElement> = () => {
        if (mission) try {
            const data: PairingCreate = {
                campaignId: period.campaignId,
                periodId: period.id,
                missionId: mission.id,
                players: playersList.map(player => {
                    return {
                        playerId: player.playerId,
                        personalMissionId: player.personalMissionId
                    }
                })
            }
            validateData<PairingCreate>(data)
            axios.post('/missions/pairings', data).then(res => {
                if (res.status === 201) onChange()
            })
        } catch (error) {
            console.log(error)
            setError(error as Error)
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={openChange}>
            <Dialog.Content aria-describedby={undefined}>
                <Dialog.Title>
                    New Pairing
                </Dialog.Title>
                <Flex direction='column' gap='3'>
                    <SelectInput
                        size='2'
                        placeholder={'Choose a mission'}
                        value={JSON.stringify(mission)}
                        onValueChange={(value) => setMission(JSON.parse(value))}
                        options={missions.reduce((acc, mission) => {
                            acc[JSON.stringify(mission)] = mission.title
                            return acc
                        }, {} as Record<string, string>)}
                    />
                    <Flex direction='column' gap='1'>
                        Players:
                        {!playersList.length && !playersOptions.length
                            ? <Text>no players available.</Text>
                            : playersList.map((player: PlayerRegister) => (
                                <NewPairingPlayer
                                    key={player.id}
                                    player={player}
                                    handleDelete={handleDelete}
                                    missions={missions}
                                    setCustomMission={handleAddCustomMission}
                                />
                            ))

                        }
                        {!!playersOptions.length && <Flex gap='1' align='center'>
                            <IconButton
                                size='1'
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
                            {addPlayer && <SelectInput
                                size='2'
                                placeholder={'Choose a player'}
                                value={playerToAdd}
                                options={playersOptions.reduce((acc, player) => {
                                    acc[JSON.stringify(player)] = player.playerUsername
                                    return acc
                                }, {} as Record<string, string>)}
                                onValueChange={setPlayerToAdd}
                            />}
                        </Flex>}
                    </Flex>
                    {!!error && <ErrorHandler error={error}/>}
                    <Flex gap='2'>
                        <Dialog.Close>
                            <Button>
                                Close
                            </Button>
                        </Dialog.Close>
                        <Button color='grass' onClick={handleSubmit}>Submit</Button>
                    </Flex>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}