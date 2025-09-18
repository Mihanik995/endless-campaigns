import {Button, Card, Container, Flex, Heading, Spinner} from "@radix-ui/themes";
import ErrorHandler from "./ErrorHandler.tsx";
import CampaignCard from "./CampaignCard.tsx";
import {useEffect, useState} from "react";
import type {Campaigns} from "../app/features/campaign/campaignSlice"
import axios from "../axios/axiosConfig";
import {useNavigate} from "react-router";

export default function () {
    const [campaigns, setCampaigns] = useState<Campaigns[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error>()
    useEffect(() => {
        setIsLoading(true)
        axios.get('/campaigns')
            .then((res) => {
                setCampaigns(res.data as Campaigns[])
            })
            .catch((err) => setError(err as Error))
            .finally(() => setIsLoading(false))
    }, [])

    const navigate = useNavigate();
    return (
        <Flex minHeight='80vh' align='center' justify='center' className='pt-25 pb-10'>
            <Card>
                {isLoading
                    ? <Spinner size='3' m='4'/>
                    : !!error
                        ? <ErrorHandler error={error}/>
                        : <>
                            <Heading mx='3'>Campaigns</Heading>
                            <Container width='100vw'>
                                {campaigns.length
                                    ? <>
                                        {campaigns.map((campaign) => (
                                            <CampaignCard
                                                key={campaign.id}
                                                {...campaign}
                                                clickable={true}
                                                onDelete={() => setCampaigns(campaigns.filter(
                                                    camp => camp.id !== campaign.id
                                                ))}
                                            />
                                        ))}
                                        <Button
                                            m='2'
                                            onClick={() => navigate('/campaigns/new')}
                                        > Create new campaign</Button>
                                    </>
                                    : <Flex align='center' justify='center' height='50vh'>
                                        <Button
                                            onClick={() => navigate('/campaigns/new')}
                                            size='4'
                                        >
                                            Create your first campaign!
                                        </Button>
                                    </Flex>
                                }
                            </Container>
                        </>
                }
            </Card>
        </Flex>
    )
}