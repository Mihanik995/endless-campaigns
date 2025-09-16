import type {Campaigns} from "../../../server/generated/prisma"
import {Button, Card, Container, Flex, Heading, Spinner} from "@radix-ui/themes";
import {useEffect, useState} from "react";

import axios from "../axios/axiosConfig.ts"
import {useNavigate} from "react-router";
import CampaignCard from "../components/CampaignCard"
import Header from "../components/Header.tsx";

export default function () {
    const [campaigns, setCampaigns] = useState<Campaigns[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    useEffect(() => {
        setIsLoading(true)
        axios.get('/campaigns')
            .then((res) => {
                setCampaigns(res.data as Campaigns[])
                setIsLoading(false)
            })
            .catch((err) => {
                setIsLoading(false)
                console.log(err)
            })
    }, [])

    const navigate = useNavigate();

    return (
        <>
            <Header/>
            <Flex minHeight='80vh' align='center' justify='center' className='pt-25 pb-10'>
                {isLoading
                    ? <Card><Spinner size='3' m='4'/></Card>
                    : <Card>
                        <Heading mx='3'>Campaigns</Heading>
                        <Container>
                            {campaigns.length
                                ? <>
                                    {campaigns.map((campaign) => (
                                        <CampaignCard key={campaign.id} {...campaign}/>
                                    ))}
                                    <Button
                                        m='2'
                                        onClick={() => navigate('/campaigns/new')}
                                    > Create new campaign</Button>
                                </>
                                : <Flex align='center' justify='center'>
                                    <Button
                                        onClick={() => navigate('/campaigns/new')}
                                        size='4'
                                    >
                                        Create your first campaign!
                                    </Button>
                                </Flex>
                            }
                        </Container>
                    </Card>
                }
            </Flex>
        </>
    )
}