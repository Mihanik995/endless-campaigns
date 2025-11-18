import type {AssetGroup, CampaignAsset} from "../types.ts";
import {Button, Card, Container, Flex, Heading, Table} from "@radix-ui/themes";
import {useState} from "react";
import NewAssetCreateDialog from "./NewAssetCreateDialog.tsx";
import CampaignAssetRow from "./CampaignAssetRow.tsx";
import AssetGroupEditDialog from "./AssetGroupEditDialog.tsx";
import AssetGroupDeleteDialog from "./AssetGroupDeleteDialog.tsx";

interface Props {
    assetsGroup: AssetGroup;
    isOwner: boolean
    onEdit: (assetGroup: AssetGroup) => void
    onDelete: () => void;
}

export default function ({assetsGroup, isOwner, onEdit, onDelete}: Props) {
    const assets = assetsGroup.assets;
    const [newOpen, setNewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    return <Container mt="3">
        <Card size="3">
            <Flex direction="column" gap="3" align="start">
                <Flex justify="between" width="100%">
                    <Button onClick={() => setNewOpen(true)}>
                        Add Asset
                    </Button>
                    <Flex gap="3" direction={{
                        initial: 'column',
                        xs: 'row'
                    }}>
                        <Button onClick={() => setEditOpen(true)}>
                            Edit Group
                        </Button>
                        <Button onClick={() => setDeleteOpen(true)} color="red">
                            Delete Group
                        </Button>
                    </Flex>
                </Flex>
                {assets.length
                    ? <Table.Root className="w-full">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>
                                    Title
                                </Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>
                                    Description
                                </Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>
                                    Owner
                                </Table.ColumnHeaderCell>
                                {isOwner &&
                                  <Table.ColumnHeaderCell>
                                    Actions
                                  </Table.ColumnHeaderCell>
                                }
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {assets.map(asset =>
                                <CampaignAssetRow
                                    asset={asset}
                                    isOwner={isOwner}
                                    onEdit={(updatedAsset) =>
                                        onEdit({
                                            ...assetsGroup,
                                            assets: assets.map(asset =>
                                                asset.id === updatedAsset.id
                                                    ? updatedAsset
                                                    : asset)
                                        })
                                    }
                                    onDelete={(id) =>
                                        onEdit({
                                            ...assetsGroup,
                                            assets: assets.filter(asset =>
                                                asset.id !== id)
                                        })
                                    }
                                />
                            )}
                        </Table.Body>
                    </Table.Root>
                    : <Flex justify="center" align="center" width="100%">
                        <Heading wrap="balance" align="center" my="9">
                            No {assetsGroup.groupTitle.toLowerCase()} created for this campaign yet.
                        </Heading>
                    </Flex>
                }
            </Flex>
        </Card>
        <NewAssetCreateDialog
            open={newOpen}
            setOpen={setNewOpen}
            groupId={assetsGroup.id}
            setNew={(asset: CampaignAsset) => onEdit({
                ...assetsGroup,
                assets: [...assets, asset]
            })}
        />
        <AssetGroupEditDialog
            open={editOpen}
            setOpen={setEditOpen}
            group={assetsGroup}
            onEdit={group => onEdit(group)}
        />
        <AssetGroupDeleteDialog
            open={deleteOpen}
            setOpen={setDeleteOpen}
            groupId={assetsGroup.id}
            onDelete={onDelete}
        />
    </Container>
}