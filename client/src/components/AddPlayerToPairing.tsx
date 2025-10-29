import SelectInput from "./SelectInput.tsx";
import type {PlayerRegister} from "../types.ts";
import {useForm} from "react-hook-form";
import {IconButton} from "@radix-ui/themes";
import {CheckIcon, Cross2Icon} from "@radix-ui/react-icons";
import {useEffect} from "react";

interface Props {
    playersOptions: PlayerRegister[]
    handleAdd: () => void,
    setPlayerToAdd: (id: string) => void,
}

interface PlayerToAdd {
    playerId: string,
}

export default function ({playersOptions, handleAdd, setPlayerToAdd}: Props) {
    const {control, watch} = useForm<PlayerToAdd>({
        defaultValues: {playerId: ''}
    })
    useEffect(() => setPlayerToAdd(watch('playerId')), [watch('playerId')])

    return <>
        <IconButton
            size='1'
            onClick={handleAdd}
            color={watch('playerId')
                ? 'grass'
                : undefined
            }
        >
            {watch('playerId')
                ? <CheckIcon/>
                : <Cross2Icon/>
            }
        </IconButton>
        <SelectInput
            size='2'
            placeholder='Choose a player'
            control={control}
            name='playerId'
            options={playersOptions.reduce((acc, player) => {
                acc[player.playerId] = player.playerUsername
                return acc
            }, {} as Record<string, string>)}
        />
    </>
}