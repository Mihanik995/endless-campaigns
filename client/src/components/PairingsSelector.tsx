import {useEffect, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import {Container, Flex, Heading, Spinner} from "@radix-ui/themes";
import ErrorHandler from "./ErrorHandler.tsx";
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
                                </>
                                : <Flex align='center' justify='center' height='50vh'>
                                    <Heading align='center'>You have no pairings for now.</Heading>
                                </Flex>
                            }
                        </Container>
                    </Container>
            }
        </Flex>
    )
}