import Header from "../components/Header.tsx";
import {useAppSelector} from "../app/hooks.ts";
import {selectCampaign} from "../app/features/campaign/campaignSlice.ts";
import CampaignSelector from "../components/CampaignSelector.tsx";
import CampaignProfile from "../components/CampaignProfile.tsx";
import {Card, Container, Tabs} from "@radix-ui/themes";
import MissionsSelector from "../components/MissionsSelector.tsx";

export default function () {
    const currentCampaign = useAppSelector(selectCampaign)

    return (
        <>
            <Header/>
            <Container className='pb-5 pt-23'>
                <Card size='1'>
                    <Tabs.Root defaultValue="missions">
                        <Tabs.List size='2'>
                            <Tabs.Trigger value="campaigns">Campaigns</Tabs.Trigger>
                            <Tabs.Trigger value="missions">Missions</Tabs.Trigger>
                        </Tabs.List>
                        <Tabs.Content value='campaigns'>
                            {currentCampaign.id
                                ? <CampaignProfile/>
                                : <CampaignSelector/>}
                        </Tabs.Content>
                        <Tabs.Content value='missions'>
                            <MissionsSelector/>
                        </Tabs.Content>
                    </Tabs.Root>
                </Card>
            </Container>
        </>
    )
}