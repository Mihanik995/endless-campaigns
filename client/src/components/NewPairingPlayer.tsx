import {Button, Flex} from "@radix-ui/themes";
import type {Mission, PlayerRegister} from "../types.ts";
import {useState} from "react";
import SelectInput from "./SelectInput.tsx";
import {useForm} from "react-hook-form";

interface Props {
    player: PlayerRegister
    handleDelete: (id: string) => void
    missions: Mission[]
    setCustomMission: (playerId: string, missionId?: string) => void
}

interface PersonalMission {
    personalMissionId: string
}

export default function ({player, handleDelete, missions, setCustomMission}: Props) {
    const [addPersonalMission, setAddPersonalMission] = useState(false)
    const {control, watch} = useForm<PersonalMission>({
        defaultValues: {personalMissionId: player.personalMissionId}
    })

    return <Flex gap='1' align='center' key={player.id}>
        - {player.playerUsername} {!!player.personalMissionId?.length &&
        `(${missions.find(mission => mission.id === player.personalMissionId)?.title})`}
        {addPersonalMission
            ? <>
                {!!watch('personalMissionId') && <Button
                    color='grass'
                    size='1'
                    onClick={() => {
                        setCustomMission(player.playerId, watch('personalMissionId'))
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
                    placeholder='Choose a mission'
                    name='personalMissionId'
                    control={control}
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
                    onClick={() => handleDelete(player.playerId)}
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