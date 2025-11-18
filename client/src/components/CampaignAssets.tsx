import type {AssetGroup, CampaignAsset} from "../types.ts";
import {Button, Card, Container, Flex, Heading, Table} from "@radix-ui/themes";
import {useState} from "react";
import NewAssetCreateDialog from "./NewAssetCreateDialog.tsx";
import CampaignAssetRow from "./CampaignAssetRow.tsx";

interface Props {
    assetsGroup: AssetGroup;
    isOwner: boolean
    onEdit: (assetGroup: AssetGroup) => void
}

export default function ({assetsGroup, isOwner, onEdit}: Props) {
    const assets = assetsGroup.assets;
    const [newOpen, setNewOpen] = useState(false);

    return <Container mt="3">
        <Card size="3">
            <Flex direction="column" gap="3" align="start">
                <Button onClick={() => setNewOpen(true)}>
                    Add Asset
                </Button>
                {assets.length
                    ? <Table.Root>
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
                        <Heading wrap="balance" align="center">
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
    </Container>
}