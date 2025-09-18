import type {Campaigns} from '../../../server/generated/prisma'

import {useNavigate, useParams} from "react-router";
import {Box, Card, Container, Flex, Spinner} from "@radix-ui/themes";
import Header from "../components/Header.tsx";
import {useEffect, useState} from "react";
import axios from '../axios/axiosConfig.ts'
import CampaignCard from "../components/CampaignCard.tsx";
import RegisteredPlayers from "../components/RegisteredPlayers.tsx";
import {useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";
import ErrorHandler from "../components/ErrorHandler.tsx";

export default function () {
    const {id: campaignId} = useParams();

    const navigate = useNavigate();

    const auth = useAppSelector(selectAuth);
    const [isOwner, setIsOwner] = useState(false);

    const [error, setError] = useState<Error>()
    const [isLoading, setIsLoading] = useState(false)
    const [campaignData, setCampaignData] = useState<Campaigns>({
        id: '',
        ownerId: '',
        title: '',
        description: '',
        regulations: '',
        dateStart: new Date(),
        dateEnd: new Date(),
        requiresRegisterApproval: false,
    })

    useEffect(() => {
        setIsLoading(true)
        axios.get(`/campaigns/${campaignId}`)
            .then(campRes => {
                if (campRes.status === 200) {
                    setCampaignData({
                        ...campRes.data,
                        dateStart: new Date(campRes.data.dateStart),
                        dateEnd: new Date(campRes.data.dateEnd),
                    })
                    setIsOwner(auth.id === campRes.data.ownerId)
                }
            }).catch(err => setError(err as Error))
            .finally(() => setIsLoading(false))
    }, []);

    return (
        <>
            <Header/>
            <Flex minHeight='80vh' align='center' justify='center' className='pt-25 pb-10'>
                <Card>
                    {isLoading
                        ? <Spinner size='3'/>
                        : !!error
                            ? <ErrorHandler error={error}/>
                            : <Container width='100vw'>
                                <CampaignCard
                                    {...campaignData}
                                    clickable={false}
                                    onDelete={() => navigate('/dashboard')}
                                />
                                <Box m='2'>
                                    <RegisteredPlayers
                                        campaignId={campaignId as string}
                                        isOwner={isOwner}
                                    />
                                </Box>

                            </Container>
                    }
                </Card>
            </Flex>
        </>
    )
}