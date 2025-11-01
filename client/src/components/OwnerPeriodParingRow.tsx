import {Button, ContextMenu, Link, Table, Text} from "@radix-ui/themes";
import type {CampaignPeriod, Mission, Pairing, PlayerRegister} from "../types.ts";
import {useState} from "react";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import {useNavigate} from "react-router";
import RejectPairingResultsDialog from "./RejectPairingResultsDialog.tsx";
import CheckPassedNodesDialog from "./CheckPassedNodesDialog.tsx";
import EditPairingDialog from "./EditPairingDialog.tsx";

interface Props {
    pairing: Pairing
    missions: Mission[]
    playerRegisters: PlayerRegister[]
    period: CampaignPeriod
    onChange: () => void
}

export default function ({pairing, missions, playerRegisters, period, onChange}: Props) {
    const [edit, setEdit] = useState(false);

    const [error, setError] = useState<Error>()
    const navigate = useNavigate()

    const handleDeletePairing = (): void => {
        axios.delete(`/missions/pairings/${pairing.id}`)
            .then(res => {
                if (res.status === 204) {
                    onChange()
                    setError(undefined)
                }
            }).catch(err => setError(err as Error));
    }



    const approveResults = (): void => {
        axios.put(`/missions/pairings/${pairing.id}/approve`)
            .then(res => {
                if (res.status === 200) {
                    onChange()
                    setError(undefined)
                }
            }).catch(err => setError(err as Error))
    }

    const [rejectOpen, setRejectOpen] = useState(false)
    const [nodesOpen, setNodesOpen] = useState(false)

    return <>
        <Table.Row>
            <Table.Cell>
                <Link
                    href=''
                    onClick={() => navigate(`/missions/${pairing.mission?.id}`)}
                >
                    {pairing.mission?.title}
                </Link>
            </Table.Cell>
            <Table.Cell minWidth='150px'>
                <Text align='center'>
                    {pairing.players
                        .map(player => player.player.username)
                        .join(' / ')
                    }
                </Text>
            </Table.Cell>
            <Table.Cell>
                {pairing.played
                    ? pairing.winners.length
                        ? pairing.winners.map(winner => winner.player?.username).join(', ')
                        : 'No winners'
                    : 'Not played yet'}
            </Table.Cell>
            <Table.Cell>
                {pairing.reportLink
                    ? <Link href={pairing.reportLink} target='_blank'>
                        {pairing.reportLink.length > 20
                            ? `${pairing.reportLink.slice(0, 20)}...`
                            : pairing.reportLink}
                    </Link>
                    : '-'}
            </Table.Cell>
            <ContextMenu.Root>
                <ContextMenu.Trigger>
                    <Table.Cell>
                        <Button>Right-click / Hold</Button>
                    </Table.Cell>
                </ContextMenu.Trigger>
                <ContextMenu.Content>
                    {pairing.played && !pairing.resultsApproved && <>
                        <ContextMenu.Item onSelect={approveResults}>
                            Approve results
                        </ContextMenu.Item>
                        <ContextMenu.Item onSelect={() => setRejectOpen(true)}>
                            Reject results
                        </ContextMenu.Item>
                        <ContextMenu.Separator/>
                    </>}
                    {pairing.mission?.nodes &&
                        <>
                            <ContextMenu.Item onSelect={() => setNodesOpen(true)}>
                                Check nodes passed
                            </ContextMenu.Item>
                            <ContextMenu.Separator/>
                        </>
                    }
                    <ContextMenu.Item onSelect={() => setEdit(true)}>
                        Edit
                    </ContextMenu.Item>
                    <ContextMenu.Item color='red' onSelect={handleDeletePairing}>
                        Delete
                    </ContextMenu.Item>
                </ContextMenu.Content>
            </ContextMenu.Root>
        </Table.Row>
        {
            !!error && <Table.Row>
                <Table.Cell colSpan={3}>
                    <ErrorHandler error={error}/>
                </Table.Cell>
            </Table.Row>
        }
        <RejectPairingResultsDialog
            open={rejectOpen}
            setOpen={setRejectOpen}
            pairing={pairing}
            onChange={onChange}
        />
        <CheckPassedNodesDialog
            open={nodesOpen}
            setOpen={setNodesOpen}
            pairing={pairing}
            onChange={onChange}
        />
        <EditPairingDialog
            open={edit}
            onOpenChange={setEdit}
            missions={missions}
            playerRegisters={playerRegisters}
            period={period}
            pairing={pairing}
            onChange={onChange}
            onError={setError}
        />
    </>
}