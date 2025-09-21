import Header from "../components/Header.tsx";
import {Card, Container, Flex, Spinner} from "@radix-ui/themes";
import {useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import MissionCard from "../components/MissionCard.tsx";
import ErrorHandler from "../components/ErrorHandler.tsx";

interface MissionData {
    [key: string]: string

    id: string;
    creatorId: string;
    title: string,
    narrativeDescription: string,
    missionConditions: string,
}

export default function () {
    const {id: missionId} = useParams()
    const [mission, setMission] = useState<MissionData>({
        id: '',
        creatorId: '',
        title: '',
        narrativeDescription: '',
        missionConditions: '',
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>()

    useEffect(() => {
        setIsLoading(true)
        axios.get(`/missions/simple/${missionId}`)
            .then(res => {
                if (res.status === 200) setMission(res.data)
            }).catch(error => setError(error as Error))
            .finally(() => setIsLoading(false))
    }, []);

    const navigate = useNavigate()

    return (
        <>
            <Header/>
            <Flex minHeight='80vh' align='center' justify='center'>
                {isLoading
                    ? <Spinner size='3' m='4'/>
                    : !!error
                        ? <ErrorHandler error={error}/>
                        : <Card>
                            <Container width='100vw'>
                                <MissionCard
                                    mission={mission}
                                    clickable={false}
                                    onDelete={() => navigate('/dashboard')}
                                />
                            </Container>
                        </Card>
                }
            </Flex>
        </>
    )
}