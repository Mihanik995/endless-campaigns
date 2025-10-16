import {Button, Flex} from "@radix-ui/themes";
import type {Mission, PlayerRegister} from "../types.ts";
import {useState} from "react";
import SelectInput from "./SelectInput.tsx";

interface Props {
    player: PlayerRegister
    handleDelete: (id: string) => void
    missions: Mission[]
    setCustomMission: (playerId: string, missionId?: string) => void
}

export default function ({player, handleDelete, missions, setCustomMission}: Props) {
    const [addPersonalMission, setAddPersonalMission] = useState(false)
    const [personalMissionToAdd, setPersonalMissionToAdd] = useState(player.personalMissionId)

    return <Flex gap='1' align='center' key={player.id}>
        - {player.playerUsername} {!!player.personalMissionId &&
        `(${missions.find(mission => mission.id === player.personalMissionId)?.title})`}
        {addPersonalMission
            ? <>
                {!!personalMissionToAdd && <Button
                    color='grass'
                    size='1'
                    onClick={() => {
                        setCustomMission(player.playerId, personalMissionToAdd)
                        setAddPersonalMission(false)
                    }}
                >
                    Add
                </Button>
                }
                <Button
                    size='1'
                    onClick={() => setAddPersonalMission(false)}
                >
                    Cancel
                </Button>
                <SelectInput
                    size='2'
                    value={personalMissionToAdd || ''}
                    onValueChange={setPersonalMissionToAdd}
                    options={missions.reduce((acc, mission) => {
                        acc[mission.id] = mission.title
                        return acc
                    }, {} as Record<string, string>)}
                />
            </>
            : <>
                <Button
                    color='red'
                    size='1'
                    onClick={() => handleDelete(player.id)}
                >
                    Delete
                </Button>
                {player.personalMissionId
                    ? <Button
                        size='1'
                        onClick={() => setCustomMission(player.playerId, undefined)}
                    >
                        Remove personal mission
                    </Button>
                    : <Button
                        size='1'
                        onClick={() => setAddPersonalMission(true)}
                    >
                        Add personal mission
                    </Button>
                }
            </>}
    </Flex>
}