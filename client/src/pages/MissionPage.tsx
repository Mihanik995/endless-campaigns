import Header from "../components/Header.tsx";
import {Card, Container, Flex, Separator, Spinner} from "@radix-ui/themes";
import {useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import MissionCard from "../components/MissionCard.tsx";
import ErrorHandler from "../components/ErrorHandler.tsx";
import type {Mission} from "../types.ts";
import MissionQuestions from "../components/MissionQuestions.tsx";

export default function () {
    const {id: missionId} = useParams()
    const [mission, setMission] = useState<Mission>({
        id: '',
        creatorId: '',
        title: '',
        narrativeDescription: '',
        nodes: []
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()

    useEffect(() => {
        setIsLoading(true)
        axios.get(`/missions/${missionId}`)
            .then(res => {
                if (res.status === 200) {
                    setMission(res.data)
                    setError(undefined)
                }
            }).catch(error => setError(error as Error))
            .finally(() => setIsLoading(false))
    }, []);

    const navigate = useNavigate()

    return (
        <>
            <Header/>
            <Container className='pb-5 pt-23'>
                <Flex minHeight='80vh' align='center' justify='center'>
                    {isLoading
                        ? <Spinner size='3' m='4'/>
                        : !!error
                            ? <ErrorHandler error={error}/>
                            : <Card>
                                <MissionCard
                                    mission={mission}
                                    clickable={false}
                                    onDelete={() => navigate('/dashboard')}
                                />
                                <Separator size='4' my='2'/>
                                <MissionQuestions
                                    mission={mission}
                                />
                            </Card>
                    }
                </Flex>
            </Container>
        </>
    )
}