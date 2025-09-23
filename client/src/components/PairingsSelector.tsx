import {useEffect, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import {Button, Container, Flex, Heading, Spinner} from "@radix-ui/themes";
import ErrorHandler from "./ErrorHandler.tsx";
import {useNavigate} from "react-router";
import PairingCard from "./PairingCard.tsx";
import type {PlayersOnPairings} from "../types.ts";

export default function () {
    const [pairings, setPairings] = useState<PlayersOnPairings[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error>()

    useEffect(() => {
        setIsLoading(true)
        axios.get('/missions/pairings')
            .then(res => {
                if (res.status === 200) setPairings(res.data)
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
                        <Heading m='2'>Pairings</Heading>
                        <Container width='100vw'>
                            {!!pairings.length
                                ? <>
                                    {pairings.map(pairing => (
                                    <PairingCard
                                        key={pairing.pairing.id}
                                        pairing={pairing.pairing}
                                    />
                                ))}
                                    <Button
                                        mx='2'
                                        mt='2'
                                        onClick={() => navigate('/campaigns/new')}
                                    >
                                        Create new mission
                                    </Button>
                                </>
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