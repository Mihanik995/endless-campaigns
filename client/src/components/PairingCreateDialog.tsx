import {Button, Dialog, Flex, IconButton, Text} from "@radix-ui/themes";
import {useState} from "react";
import {PlusIcon} from "@radix-ui/react-icons";
import axios from "../axios/axiosConfig.ts";
import type {CampaignPeriod, Mission, PlayerRegister} from "../types.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import SelectInput from "./SelectInput.tsx";
import NewPairingPlayer from "./NewPairingPlayer.tsx";
import {type SubmitHandler, useForm} from "react-hook-form";
import AddPlayerToPairing from "./AddPlayerToPairing.tsx";

interface Props {
    open: boolean;
    openChange: (open: boolean) => void;
    playerRegisters: PlayerRegister[],
    missions: Mission[],
    period: CampaignPeriod
    onChange: () => void
}

interface PairingMission {
    missionId: string;
}

export default function ({playerRegisters, period, onChange, missions, open, openChange}: Props) {
    const [playersOptions, setPlayersOptions] = useState<PlayerRegister[]>(playerRegisters)
    const [playersList, setPlayersList] = useState<PlayerRegister[]>([])
    const {control, handleSubmit} = useForm<PairingMission>({
        mode: "onBlur"
    })
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

    const handleAddCustomMission = (playerId: string, missionId?: string) => {
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

    const [error, setError] = useState<Error>()
    const onSubmit: SubmitHandler<PairingMission> = (data) => {
        if (playersList.length) axios.post('/missions/pairings', {
            campaignId: period.campaignId,
            periodId: period.id,
            missionId: data.missionId,
            players: playersList.map(player => {
                return {
                    playerId: player.playerId,
                    personalMissionId: player.personalMissionId
                }
            })
        }).then(res => {
            if (res.status === 201) {
                onChange()
                setError(undefined)
            }
        }).catch((error) => setError(error as Error))

        else setError(new Error('No players assigned to the pairing!'))
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
                        placeholder='Choose a mission'
                        name='missionId'
                        control={control}
                        options={missions.reduce((acc, mission) => {
                            acc[mission.id] = mission.title
                            return acc
                        }, {} as Record<string, string>)}
                    />
                    <Flex direction='column' gap='1'>
                        Players:
                        {!playersList.length && !playersOptions.length
                            ? <Text>no players available.</Text>
                            : playersList
                                .map((player: PlayerRegister) => (
                                    <NewPairingPlayer
                                        key={player.playerId}
                                        player={player}
                                        handleDelete={handleDelete}
                                        missions={missions}
                                        setCustomMission={handleAddCustomMission}
                                    />
                                ))

                        }
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
                    {!!error && <ErrorHandler error={error}/>}
                    <Flex gap='2'>
                        <Dialog.Close>
                            <Button>
                                Close
                            </Button>
                        </Dialog.Close>
                        <Button color='grass' onClick={handleSubmit(onSubmit)}>Submit</Button>
                    </Flex>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}