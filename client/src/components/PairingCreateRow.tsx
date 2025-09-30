import {Button, Flex, IconButton, Table, Text} from "@radix-ui/themes";
import {type MouseEventHandler, useState} from "react";
import {CheckIcon, Cross2Icon, PlusIcon} from "@radix-ui/react-icons";
import axios from "../axios/axiosConfig.ts";
import type {CampaignPeriod, Mission, PairingCreate, PlayerRegister} from "../types.ts";
import validateData from "../utils/validators/validateData.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import SelectInput from "./SelectInput.tsx";

interface Props {
    playerRegisters: PlayerRegister[],
    missions: Mission[],
    period: CampaignPeriod
    onChange: () => void
}

export default function ({playerRegisters, period, onChange, missions}: Props) {
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
                playerIds: playersList.map(player => player.playerId)
            }
            validateData<PairingCreate>(data)
            axios.post('/missions/pairings', data).then(res => {
                if (res.status === 201) onChange()
            })
        } catch (error) {
            setError(error as Error)
        }
    }

    return (
        <Table.Row>
            <Table.Cell colSpan={2}>
                <Flex direction='column' gap='2'>
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
                    <Flex gap='2' align='center'>
                        Players:
                        {!playersList.length && !playersOptions.length
                            ? <Text>no players available.</Text>
                            : playersList.map((player: PlayerRegister) => (
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
                        {!!playersOptions.length && <Flex gap='1' align='center'>
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
                </Flex>
            </Table.Cell>
            <Table.Cell>
                <Flex direction='column' gap='2' align='start'>
                    {!!error && <ErrorHandler error={error}/>}
                    <Button color='grass' onClick={handleSubmit}>Submit</Button>
                </Flex>
            </Table.Cell>
        </Table.Row>
    )
}