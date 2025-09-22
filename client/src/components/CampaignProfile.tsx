import {useNavigate} from "react-router";
import {Box, Container, Flex, Tabs} from "@radix-ui/themes";
import CampaignCard from "../components/CampaignCard.tsx";
import RegisteredPlayers from "../components/RegisteredPlayers.tsx";
import {useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";
import CampaignPeriods from "../components/CampaignPeriods.tsx";
import {selectCampaign} from "../app/features/campaign/campaignSlice.ts";
import type {Campaign} from "../types.ts";

export default function () {
    const campaign = useAppSelector(selectCampaign) as Campaign;
    const auth = useAppSelector(selectAuth);

    const navigate = useNavigate();
    const isOwner = campaign.ownerId === auth.id

    return (
        <Flex minHeight='80vh' align='center' justify='center'>
            <Container width='100vw'>
                <CampaignCard
                    campaignData={campaign}
                    clickable={false}
                    onDelete={() => navigate('/dashboard')}
                />
                <Box m='2'>
                    <Tabs.Root defaultValue='periods'>
                        <Tabs.List>
                            <Tabs.Trigger value='registers'>Players</Tabs.Trigger>
                            <Tabs.Trigger value='periods'>Periods and Pairings</Tabs.Trigger>
                        </Tabs.List>
                        <Tabs.Content value='registers'>
                            <RegisteredPlayers
                                campaignId={campaign.id}
                                isOwner={isOwner}
                            />
                        </Tabs.Content>
                        <Tabs.Content value='periods'>
                            <CampaignPeriods
                                campaignId={campaign.id}
                                isOwner={isOwner}
                            />
                        </Tabs.Content>
                    </Tabs.Root>
                </Box>
            </Container>
        </Flex>
    )
}