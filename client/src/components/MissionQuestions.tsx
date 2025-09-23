import {Button, Flex, Grid, Heading, Popover, Spinner, Text} from "@radix-ui/themes";
import type {Question, SimpleMission} from "../types.ts";
import {type MouseEventHandler, useEffect, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import MissionQuestionCard from "./MissionQuestionCard.tsx";
import ErrorHandler from "./ErrorHandler.tsx";
import {useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";
import TextInput from "./TextInput.tsx";

interface Props {
    mission: SimpleMission
}

export default function ({mission}: Props) {
    const auth = useAppSelector(selectAuth);

    const [error, setError] = useState<Error>()
    const [isLoading, setIsLoading] = useState(false)
    const [change, setChange] = useState(0)
    const [questions, setQuestions] = useState<Question[]>([])
    const isOwner = mission.creatorId === auth.id
    useEffect(() => {
        setIsLoading(true)
        axios.get(`missions/questions/mission/${mission.id}`)
            .then(res => {
                if (res.status === 200) {
                    setQuestions(res.data)
                }
            }).catch(error => setError(error as Error))
            .finally(() => setIsLoading(false))
    }, [change]);

    const [newQuestionText, setNewQuestionText] = useState('')
    const handleNewQuestion: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        axios.post(`missions/questions/`, {text: newQuestionText, missionId: mission.id})
            .then(res => {
                if (res.status === 201) setQuestions([...questions, res.data])
            }).catch(err => setError(err as Error))
    }

    return isLoading
        ? <Spinner size='3'/>
        : !!error
            ? <ErrorHandler error={error}/>
            : <Flex direction='column' gap='3'>
                <Heading>Questions</Heading>
                {questions.length
                    ? <Grid columns={questions.length > 3 ? '3' : `${questions.length}`} gap='3' width='auto'>
                        {questions.map(q => (
                            <MissionQuestionCard
                                key={q.id}
                                question={q}
                                isMissionOwner={isOwner}
                                onChange={() => setChange(change + 1)}
                            />
                        ))}
                    </Grid>
                    : <Text size='4' align='center' my='3'>No questions asked yet.</Text>}
                {!isOwner &&
                    <Popover.Root>
                        <Popover.Trigger>
                            <Button>Ask question</Button>
                        </Popover.Trigger>
                        <Popover.Content>
                            <Flex direction='column' gap='2'>
                                <TextInput
                                    label='Question'
                                    value={newQuestionText}
                                    onChange={(e) => setNewQuestionText(e.target.value)}
                                    name='newQuestionText'
                                />
                                <Flex gap='2'>
                                    <Popover.Close>
                                        <Button>Close</Button>
                                    </Popover.Close>
                                    <Popover.Close>
                                        <Button onClick={handleNewQuestion}>Submit</Button>
                                    </Popover.Close>
                                </Flex>
                            </Flex>
                        </Popover.Content>
                    </Popover.Root>
                }
            </Flex>
}