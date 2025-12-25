import {Button, Dialog, Flex, IconButton, Spinner, Strong, Text} from "@radix-ui/themes";
import SelectInput from "./SelectInput.tsx";
import type {CampaignAsset, CampaignPeriod, Mission, Pairing, PlayerRegister} from "../types.ts";
import {Cross2Icon, PlusIcon} from "@radix-ui/react-icons";
import axios from "../axios/axiosConfig.ts";
import {useState} from "react";
import NewPairingPlayer from "./NewPairingPlayer.tsx";
import AddPlayerToPairing from "./AddPlayerToPairing.tsx";
import {type SubmitHandler, useForm} from "react-hook-form";
import CheckManyInput from "./CheckManyInput.tsx";
import ErrorHandler from "./ErrorHandler.tsx";
import {Select} from "@radix-ui/themes";

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    missions: Mission[]
    availableRewards: CampaignAsset[]
    playerRegisters: PlayerRegister[]
    period: CampaignPeriod
    pairing: Pairing
    onEdit: (pairing: Pairing) => void
}

interface PairingMissionAndWinners {
    missionId: string
    winners: string[]
}

export default function ({open, onOpenChange, missions, availableRewards, playerRegisters, pairing, onEdit}: Props) {
    const initialPlayersList = playerRegisters.filter(pr => pairing.players
        .map(p => p.playerId).includes(pr.playerId))
    const [playersList, setPlayersList] = useState<PlayerRegister[]>(initialPlayersList)
    const {control, handleSubmit} = useForm<PairingMissionAndWinners>({
        defaultValues: {
            missionId: pairing.missionId,
            winners: pairing.winners.map(winner => winner.playerId as string)
        }
    })

    const [pairingRewards, setPairingRewards] = useState<string[]>(pairing.rewardsOnPairings.map(ROP => ROP.asset.id))
    const rewardOptions = availableRewards.filter(reward =>
        !pairingRewards.includes(reward.id) &&
        (!reward.ownerId || playersList.map(reg => reg.id).includes(reward.ownerId))
    )

    const [playersOptions, setPlayersOptions] = useState<PlayerRegister[]>(
        playerRegisters.filter(pr => !playersList
            .map(p => p.playerId).includes(pr.playerId))
    )
    const [addPlayer, setAddPlayer] = useState(false)
    const [playerToAdd, setPlayerToAdd] = useState('')

    const handleAdd = () => {
        if (addPlayer && playerToAdd.length) {
            const newPlayersList = [
                ...playersList,
                playerRegisters.find(player => player.playerId === playerToAdd) as PlayerRegister
            ]
            setPlayersList(newPlayersList)
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
        const newPlayersList = playersList.filter(player => player.id !== id)
        setPlayersList(newPlayersList)
        setPlayersOptions([
            ...playersOptions,
            playerRegisters.find(player => player.id === id) as PlayerRegister
        ])
        setPairingRewards(pairingRewards
            .filter(assetId => availableRewards
                .find(asset => asset.ownerId === id)?.id !== assetId))
    }

    const handleAddReward = (rewardId: string) => {
        setPairingRewards([...pairingRewards, rewardId])
    }

    const handleDeleteReward = (rewardId: string) => {
        setPairingRewards(pairingRewards.filter(assetId => assetId != rewardId))
    }

    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const onSubmit: SubmitHandler<PairingMissionAndWinners> = (data) => {
        setIsLoading(true)
        axios.put<Pairing>(`/missions/pairings/${pairing.id}`, {
            campaignId: pairing.campaignId,
            periodId: pairing.periodId,
            players: playersList.map(player => {
                return {
                    playerId: player.playerId,
                    personalMissionId: player.personalMissionId
                }
            }),
            rewards: pairingRewards,
            ...data
        }).then(res => {
            if (res.status === 200) {
                onEdit(res.data)
                onOpenChange(false)
                setError(undefined)
            }
        }).catch(err => setError(err))
            .finally(() => setIsLoading(false))
    }

    return <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Content>
            <Dialog.Title>Edit Pairing</Dialog.Title>
            <Dialog.Description>
                <Text color="red"><Strong>NOTICE!</Strong></Text> Any changes will
                drop players' mission progress (if any).
            </Dialog.Description>
            <Flex direction="column" gap="2" mt="3">
                <SelectInput
                    size="2"
                    placeholder="Choose a mission"
                    name="missionId"
                    control={control}
                    options={missions.reduce((acc, mission) => {
                        acc[mission.id] = mission.title
                        return acc
                    }, {} as Record<string, string>)}
                />
                <Flex gap="2" direction="column">
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
                    {!!playersOptions.length && <Flex gap="1" align="center">
                        {addPlayer
                            ? <AddPlayerToPairing
                                playersOptions={playersOptions}
                                handleAdd={handleAdd}
                                setPlayerToAdd={setPlayerToAdd}
                            />
                            : <IconButton
                                size="1"
                                onClick={handleAdd}
                                color="grass"
                            >
                                <PlusIcon/>
                            </IconButton>}
                    </Flex>}
                </Flex>
                <Flex gap="2" direction="column">
                    Rewards:
                    <Flex direction="column" gap="1">
                        {pairingRewards.map(reward => <Flex gap="2">
                                <IconButton
                                    color="red"
                                    size="1"
                                    onClick={() => handleDeleteReward((availableRewards.find(asset => asset.id === reward) as CampaignAsset).id)}
                                >
                                    <Cross2Icon/>
                                </IconButton>
                                <Text>
                                    {availableRewards.find(asset => asset.id === reward)?.title}
                                </Text>
                            </Flex>
                        )}
                        {!!rewardOptions.length &&
                          <Select.Root
                            size="2"
                            key={pairingRewards.length}
                            onValueChange={handleAddReward}
                          >
                            <Select.Trigger placeholder="Select a reward (optional)"/>
                            <Select.Content>
                                {rewardOptions.map(reward =>
                                    <Select.Item key={reward.id} value={reward.id}>{reward.title}</Select.Item>)
                                }
                            </Select.Content>
                          </Select.Root>
                        }
                    </Flex>
                </Flex>
                <Flex gap="2" align="center">
                    Winners:
                    <CheckManyInput
                        name="winners"
                        control={control}
                        values={playersList.map((player) => {
                            return {
                                value: player.playerId,
                                title: player.playerUsername
                            }
                        })}
                    />
                </Flex>
                {!!error && <ErrorHandler error={error}/>}
                <Flex gap="3">
                    <Dialog.Close>
                        <Button disabled={isLoading}>Cancel</Button>
                    </Dialog.Close>
                    <Button
                        color="grass"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? <Spinner size="1"/>
                            : 'Submit'
                        }
                    </Button>
                </Flex>
            </Flex>
        </Dialog.Content>
    </Dialog.Root>
}