import {Flex, IconButton, Spinner, Table, Text, Tooltip} from "@radix-ui/themes";
import type {CampaignAsset} from "../types.ts";
import purifyHTML from "../utils/validators/purifyHTML.ts";
import {Cross2Icon, Pencil2Icon} from "@radix-ui/react-icons";
import {useState} from "react";
import AssetEditDialog from "./AssetEditDialog.tsx";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "./ErrorHandler.tsx";

interface Props {
    asset: CampaignAsset
    isOwner: boolean
    onEdit: (asset: CampaignAsset) => void
    onDelete: (id: string) => void
}

export default function ({asset, isOwner, onEdit, onDelete}: Props) {
    const [editOpen, setEditOpen] = useState(false)

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()
    const handleDelete = (id: string) => {
        setIsLoading(true)
        axios.delete(`/campaigns/assets/${id}`)
            .then(res => {
                if (res.status === 204) {
                    onDelete(id)
                    setError(undefined)
                }
            }).catch(err => setError(err))
            .finally(() => setIsLoading(false))
    }

    return <>
    <Table.Row key={asset.id}>
        <Table.Cell>
            <Text weight='bold' size='3'>
                {asset.title}
            </Text>
        </Table.Cell>
        <Table.Cell>
            <div
                dangerouslySetInnerHTML={{
                    __html: purifyHTML(asset.description)
                }}
                className='ProseMirror'
            />
        </Table.Cell>
        {isOwner &&
            <Table.Cell>
                <Flex gap='2'>
                    <Tooltip content='Edit'>
                        <IconButton
                            radius='full'
                            onClick={() => setEditOpen(true)}
                            disabled={isLoading}
                        >
                            <Pencil2Icon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip content='Delete'>
                        <IconButton
                            color='red'
                            radius='full'
                            onClick={() => handleDelete(asset.id)}
                            disabled={isLoading}
                        >
                            {isLoading
                                ? <Spinner size='1'/>
                                : <Cross2Icon/>
                            }
                        </IconButton>
                    </Tooltip>
                </Flex>
            </Table.Cell>
        }
    </Table.Row>
    {!!error &&
        <Table.Row>
            <Table.Cell colSpan={3}>
                <ErrorHandler error={error}/>
            </Table.Cell>
        </Table.Row>
    }
    <AssetEditDialog
        open={editOpen}
        setOpen={setEditOpen}
        asset={asset}
        onEdit={onEdit}
    />
    </>
}