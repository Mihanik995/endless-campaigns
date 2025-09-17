import type {Campaigns} from '../../../server/generated/prisma'

import {useNavigate, useParams} from "react-router";
import {Box, Card, Container, Flex, Spinner} from "@radix-ui/themes";
import Header from "../components/Header.tsx";
import {useEffect, useState} from "react";
import axios from '../axios/axiosConfig.ts'
import CampaignCard from "../components/CampaignCard.tsx";
import {useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";
import CampaignRegisterForm from "../components/CampaignRegisterForm.tsx";
import RegisteredPlayers from "../components/RegisteredPlayers.tsx";

export default function () {
    const {id: campaignId} = useParams();

    const auth = useAppSelector(selectAuth)
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false)
    const [isOwner, setIsOwner] = useState(false);

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
                    setIsOwner(campRes.data.ownerId === auth.id)
                }
            }).catch(err => console.log(err))
            .finally(() => setIsLoading(false))
    }, []);

    return (
        <>
            <Header/>
            <Flex minHeight='80vh' align='center' justify='center' className='pt-25 pb-10'>
                <Card>
                    {isLoading
                        ? <Spinner size='3'/>
                        : <Container width='100vw'>
                            <CampaignCard
                                {...campaignData}
                                clickable={false}
                                onDelete={() => navigate('/dashboard')}
                            />
                            <Box p='2'>
                                {isOwner
                                    ? <RegisteredPlayers campaignId={campaignId as string}/>
                                    : <CampaignRegisterForm campaignId={campaignId as string}/>}
                            </Box>

                        </Container>
                    }
                </Card>
            </Flex>
        </>
    )
}