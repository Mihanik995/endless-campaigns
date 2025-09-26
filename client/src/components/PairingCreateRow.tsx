import {Box, Button, Flex, IconButton, Select, Table, Text} from "@radix-ui/themes";
import {type MouseEventHandler, useState} from "react";
import {CheckIcon, Cross2Icon, PlusIcon} from "@radix-ui/react-icons";
import axios from "../axios/axiosConfig.ts";
import type {CampaignPeriod, PairingCreate, PlayerRegister, Mission} from "../types.ts";
import validateData from "../utils/validators/validateData.ts";
import ErrorHandler from "./ErrorHandler.tsx";

interface Props {
    playerRegisters: PlayerRegister[],
    missions: Mission[],
    period: CampaignPeriod
    onChange: () => void
}

export default function ({playerRegisters, period, onChange, missions}: Props) {
    const [playersList, setPlayersList] = useState<PlayerRegister[]>([])
    const [playersOptions, setPlayersOptions] = useState<PlayerRegister[]>(playerRegisters)
    const [mission, setMission] = useState<Mission>({
        id: '', creatorId: '', title: '', narrativeDescription: '', missionConditions: ''
    })

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
        try {
            const data: PairingCreate = {
                campaignId: period.campaignId,
                periodId: period.id,
                simpleMissionId: mission.id,
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
                    <Select.Root
                        defaultValue={mission.id}
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