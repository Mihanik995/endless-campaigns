import {Box, Button, Flex, IconButton, Select, Table, Text} from "@radix-ui/themes";
import {type MouseEventHandler, useState} from "react";
import {Cross2Icon, PlusIcon} from "@radix-ui/react-icons";
import axios from "../axios/axiosConfig.ts";

interface PlayerRegister {
    id: string;
    playerId: string;
    username: string;
}

interface Period {
    id: string;
    campaignId: string;
    dateStart: string;
    dateEnd: string;
}

interface Mission {
    id: string;
    title: string;
}

interface Props {
    players: PlayerRegister[],
    missions: Mission[],
    period: Period
    onChange: () => void
}

export default function ({players, period, onChange, missions}: Props) {
    const [playersList, setPlayersList] = useState<PlayerRegister[]>([])
    const [playersOptions, setPlayersOptions] = useState<PlayerRegister[]>(players)
    const [mission, setMission] = useState<Mission>({id: '', title: ''})

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
            players.find(player => player.id === id) as PlayerRegister
        ])
    }

    const handleSubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()

        axios.post('/missions/pairings', {
            campaignId: period.campaignId,
            periodId: period.id,
            simpleMissionId: mission.id,
            playerIds: playersList.map(player => player.playerId)
        }).then(res => {
            if (res.status === 201) onChange()
        })
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
                                <Select.Item value={JSON.stringify(mission)}>
                                    {mission.title}
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Root>
                    <Flex gap='2' align='center'>
                        Players:
                        {playersList.map((player: PlayerRegister) => (
                            <Flex gap='1' align='center' key={player.id}>
                                {player.username}
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
                            <IconButton onClick={handleAdd}>
                                <PlusIcon/>
                            </IconButton>
                            {addPlayer && <Select.Root defaultValue='' onValueChange={setPlayerToAdd}>
                                <Select.Trigger placeholder='Choose a player'/>
                                <Select.Content>
                                    {playersOptions.map((player: PlayerRegister) => (
                                        <Select.Item key={player.id} value={JSON.stringify(player)}>
                                            {player.username}
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Root>}
                        </Box>}
                    </Flex>
                </Flex>
            </Table.Cell>
            <Table.Cell>
                <Button color='grass' onClick={handleSubmit}>Submit</Button>
            </Table.Cell>
        </Table.Row>
    )
}