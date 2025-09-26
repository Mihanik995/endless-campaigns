import {useEffect, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import {Button, Container, Flex, Spinner} from "@radix-ui/themes";
import ErrorHandler from "./ErrorHandler.tsx";
import {useNavigate} from "react-router";
import MissionCard from "./MissionCard.tsx";
import {Heading} from "@radix-ui/themes";
import type {Mission} from "../types.ts";

export default function () {
    const [missions, setMissions] = useState<Mission[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error>()

    useEffect(() => {
        setIsLoading(true)
        axios.get('/missions')
            .then(res => {
                if (res.status === 200) setMissions(res.data)
            }).catch(err => setError(err))
            .finally(() => setIsLoading(false))
    }, []);

    const navigate = useNavigate();

    return (
        <Flex minHeight='40vh' align='center' justify='center'>
            {isLoading
                ? <Spinner size='3' m='4'/>
                : !!error
                    ? <ErrorHandler error={error}/>
                    : <Container className='mt-3'>
                        <Heading m='2'>Missions</Heading>
                        <Container width='100vw'>
                            {!!missions.length
                                ? <>{missions.map((mission) => (
                                    <MissionCard
                                        key={mission.id}
                                        mission={mission}
                                        clickable={true}
                                        onDelete={() => setMissions(missions.filter(
                                            mission => mission.id !== mission.id
                                        ))}
                                    />
                                ))}
                                    <Button
                                        mx='2'
                                        mt='2'
                                        onClick={() => navigate('/missions/new')}
                                    >
                                        Create new mission
                                    </Button></>
                                : <Flex align='center' justify='center' height='50vh'>
                                    <Button
                                        onClick={() => navigate('/missions/new')}
                                        size='4'
                                    >
                                        Create your first mission!
                                    </Button>
                                </Flex>
                            }
                        </Container>
                    </Container>
            }
        </Flex>
    )
}