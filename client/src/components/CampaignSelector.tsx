import {Button, Container, Flex, Heading, Spinner} from "@radix-ui/themes";
import ErrorHandler from "./ErrorHandler.tsx";
import CampaignCard from "./CampaignCard.tsx";
import {useEffect, useState} from "react";
import axios from "../axios/axiosConfig";
import {useNavigate} from "react-router";
import type {Campaign} from "../types.ts";

export default function () {
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error>()
    useEffect(() => {
        setIsLoading(true)
        axios.get<Campaign[]>('/campaigns')
            .then((res) => {
                setCampaigns(res.data
                    .map(c => {
                        return {
                            ...c,
                            dateStart: new Date(c.dateStart).toLocaleDateString(),
                            dateEnd: new Date(c.dateEnd).toLocaleDateString(),
                        }
                    }))
            })
            .catch((err) => setError(err as Error))
            .finally(() => setIsLoading(false))
    }, [])

    console.log(campaigns)

    const navigate = useNavigate();
    return (
        <Flex minHeight='40vh' align='center' justify='center'>
            {isLoading
                ? <Spinner size='3' m='4'/>
                : !!error
                    ? <ErrorHandler error={error}/>
                    : <Container className='mt-3'>
                        <Heading m='2'>Campaigns</Heading>
                        <Container width='100vw'>
                            {campaigns.length
                                ? <>
                                    {campaigns.map((campaign) => (
                                        <CampaignCard
                                            key={campaign.id}
                                            campaignData={campaign}
                                            clickable={true}
                                            onDelete={() => setCampaigns(campaigns.filter(
                                                camp => camp.id !== campaign.id
                                            ))}
                                        />
                                    ))}
                                    <Button
                                        mx='2'
                                        mt='2'
                                        onClick={() => navigate('/campaigns/new')}
                                    >
                                        Create new campaign
                                    </Button>
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
                    </Container>
            }
        </Flex>
    )
}