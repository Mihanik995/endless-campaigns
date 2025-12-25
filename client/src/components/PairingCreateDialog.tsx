import {Button, Dialog, Flex, IconButton, Select, Spinner, Text} from "@radix-ui/themes";
import {useState} from "react";
import {Cross2Icon, PlusIcon} from "@radix-ui/react-icons";
import axios from "../axios/axiosConfig.ts";
import type {CampaignAsset, CampaignPeriod, Mission, Pairing, PlayerRegister} from "../types.ts";
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
    availableRewards: CampaignAsset[]
    period: CampaignPeriod
    onEdit: (pairing: Pairing) => void
}

interface PairingMission {
    missionId: string;
}

export default function ({playerRegisters, period, onEdit, missions, availableRewards, open, openChange}: Props) {
    const [playersOptions, setPlayersOptions] = useState<PlayerRegister[]>(playerRegisters)
    const [playersList, setPlayersList] = useState<PlayerRegister[]>([])

    const [pairingRewards, setPairingRewards] = useState<string[]>([])
    const [rewardsOptions, setRewardsOptions] = useState(availableRewards.filter(asset =>
        !asset.ownerId ||
        playersList.map(playerRegister => playerRegister.playerId).includes(asset.ownerId)
    ))

    const {control: missionControl, handleSubmit} = useForm<PairingMission>({mode: "onBlur"})

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

    const handleAddReward = (rewardId: string) => {
        setPairingRewards([...pairingRewards, rewardId])
        setRewardsOptions(rewardsOptions.filter(asset => asset.id !== rewardId))
    }

    const handleDeleteReward = (rewardId: string) => {
        setPairingRewards(pairingRewards.filter(assetId => assetId != rewardId))
        setRewardsOptions([
            ...rewardsOptions,
            (availableRewards.find(reward => reward.id === rewardId) as CampaignAsset)
        ])
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
    const [isLoading, setIsLoading] = useState(false)
    const onSubmit: SubmitHandler<PairingMission> = (data) => {
        if (playersList.length) {
            setIsLoading(true)
            axios.post<Pairing>('/missions/pairings', {
                campaignId: period.campaignId,
                periodId: period.id,
                missionId: data.missionId,
                players: playersList.map(player => {
                    return {
                        playerId: player.playerId,
                        personalMissionId: player.personalMissionId
                    }
                }),
                rewards: pairingRewards
            }).then(res => {
                if (res.status === 201) {
                    onEdit(res.data)
                    setError(undefined)
                    openChange(false)
                }
            }).catch((error) => setError(error as Error))
                .finally(() => setIsLoading(false))
        } else setError(new Error('No players assigned to the pairing!'))
    }

    return (
        <Dialog.Root open={open} onOpenChange={openChange}>
            <Dialog.Content aria-describedby={undefined}>
                <Dialog.Title>
                    New Pairing
                </Dialog.Title>
                <Flex direction="column" gap="3">
                    <SelectInput
                        size="2"
                        placeholder="Choose a mission"
                        name="missionId"
                        control={missionControl}
                        options={missions.reduce((acc, mission) => {
                            acc[mission.id] = mission.title
                            return acc
                        }, {} as Record<string, string>)}
                    />
                    <Flex direction="column" gap="1">
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
                            {!!rewardsOptions.length &&
                              <Select.Root
                                size="2"
                                key={pairingRewards.length}
                                onValueChange={handleAddReward}
                              >
                                <Select.Trigger placeholder="Select a reward (optional)"/>
                                <Select.Content>
                                    {rewardsOptions.map(reward =>
                                        <Select.Item key={reward.id} value={reward.id}>{reward.title}</Select.Item>)
                                    }
                                </Select.Content>
                              </Select.Root>
                            }
                        </Flex>
                    </Flex>
                    {!!error && <ErrorHandler error={error}/>}
                    <Flex gap="2">
                        <Dialog.Close>
                            <Button>
                                Close
                            </Button>
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
    )
}