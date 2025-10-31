import type {Campaign, CampaignAsset} from "../types.ts";
import {Button, Card, Container, Flex, Heading, Table} from "@radix-ui/themes";
import {useState} from "react";
import NewAssetCreateDialog from "./NewAssetCreateDialog.tsx";
import CampaignAssetRow from "./CampaignAssetRow.tsx";

interface Props {
    campaign: Campaign;
    isOwner: boolean
}

export default function ({campaign, isOwner}: Props) {
    const [assets, setAssets] = useState<CampaignAsset[]>(campaign.assets)
    const [newOpen, setNewOpen] = useState(false);

    return <Container mt='3'>
        <Card size='3'>
            <Flex direction='column' gap='3' align='start'>
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
                                        setAssets(assets.map(asset =>
                                            asset.id === updatedAsset.id
                                                ? updatedAsset
                                                : asset))
                                    }
                                    onDelete={(id) =>
                                        setAssets(assets.filter(asset =>
                                            asset.id !== id))
                                    }
                                />
                            )}
                        </Table.Body>
                    </Table.Root>
                    : <Flex justify='center' align='center' width='100%'>
                        <Heading wrap='balance' align='center'>
                            No {campaign.assetsTitle.toLowerCase()} created for this campaign yet.
                        </Heading>
                    </Flex>
                }
            </Flex>
        </Card>
        <NewAssetCreateDialog
            open={newOpen}
            setOpen={setNewOpen}
            campaignId={campaign.id}
            setNew={(asset: CampaignAsset) => setAssets([
                ...assets, asset
            ])}
        />
    </Container>
}