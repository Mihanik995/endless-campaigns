import type {Campaigns} from "../../../server/generated/prisma"
import Header from "../components/Header.tsx";
import {Button, Card, Flex, Heading, Section, Spinner} from "@radix-ui/themes";
import {useEffect, useState} from "react";

import axios from "../axios/axiosConfig.ts"
import {useNavigate} from "react-router";

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
            <Flex minHeight='100vh' align='center' justify='center'>
                {isLoading
                    ? <Spinner size='3' m='4'/>
                    : <Card>
                        <Heading>Campaigns</Heading>
                        <Flex minHeight='200px' width='90vw' justify='center' align='center'>
                            {campaigns.length
                                ? <Section>
                                </Section>
                                : <Flex align='center' justify='center'>
                                    <Button
                                        onClick={() => navigate('/campaigns/new')}
                                        size='4'
                                    >
                                        Create your first campaign!
                                    </Button>
                                </Flex>
                            }
                        </Flex>
                    </Card>
                }
            </Flex>
        </>
    )
}