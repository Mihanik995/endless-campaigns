import {useNavigate} from "react-router";
import {Box, Container, Flex, Spinner, Tabs} from "@radix-ui/themes";
import CampaignCard from "../components/CampaignCard.tsx";
import RegisteredPlayers from "../components/RegisteredPlayers.tsx";
import {useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";
import CampaignPeriods from "../components/CampaignPeriods.tsx";
import {selectCampaign} from "../app/features/campaign/campaignSlice.ts";
import type {Campaign, CustomNotification} from "../types.ts";
import {useEffect, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import CampaignNotifications from "./CampaignNotifications.tsx";

interface Props {
    id?: string;
}

export default function ({id}: Props) {
    const campaignId = id || useAppSelector(selectCampaign).id as string
    const [campaign, setCampaign] = useState<Campaign>()
    const [isOwner, setIsOwner] = useState<boolean>()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()

    useEffect(() => {
        setIsLoading(true)
        axios.get<Campaign>(`campaigns/${campaignId}`)
            .then(res => {
                if (res.status === 200) {
                    setCampaign({
                        ...res.data,
                        dateStart: new Date(res.data.dateStart).toLocaleDateString(),
                        dateEnd: new Date(res.data.dateEnd).toLocaleDateString(),
                    })
                    setIsOwner(res.data.ownerId === auth.id)
                }
            }).catch(err => setError(err as Error))
            .finally(() => setIsLoading(false))
    }, []);

    const auth = useAppSelector(selectAuth);

    const navigate = useNavigate();

    return (
        <Flex minHeight='40vh' align='center' justify='center'>
            {isLoading
                ? <Spinner size='3'/>
                : !!error
                    ? <ErrorHandler error={error}/>
                    : campaign
                        ? <Container width='100vw'>
                            <CampaignCard
                                campaignData={campaign}
                                clickable={false}
                                onDelete={() => navigate('/dashboard')}
                            />
                            <Box m='2'>
                                <Tabs.Root defaultValue='registers'>
                                    <Tabs.List>
                                        <Tabs.Trigger value='registers'>Players</Tabs.Trigger>
                                        <Tabs.Trigger value='periods'>Periods and Pairings</Tabs.Trigger>
                                        {isOwner &&
                                            <Tabs.Trigger value='notifications'>Notifications</Tabs.Trigger>
                                        }
                                    </Tabs.List>
                                    <Tabs.Content value='registers'>
                                        <RegisteredPlayers
                                            campaignId={campaign.id}
                                            isOwner={isOwner as boolean}
                                        />
                                    </Tabs.Content>
                                    <Tabs.Content value='periods'>
                                        <CampaignPeriods
                                            campaignId={campaign.id}
                                            isOwner={isOwner as boolean}
                                        />
                                    </Tabs.Content>
                                    <Tabs.Content value='notifications'>
                                        <CampaignNotifications
                                            campaignNotifications={
                                                campaign.customNotifications as CustomNotification[]
                                            }
                                            campaignId={campaign.id}
                                        />
                                    </Tabs.Content>
                                </Tabs.Root>
                            </Box>
                        </Container>
                        : <></>}
        </Flex>
    )
}