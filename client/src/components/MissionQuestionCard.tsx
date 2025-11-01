import type {Question} from "../types.ts";
import {Box, Button, Card, Flex, Separator, Text, TextField} from "@radix-ui/themes";
import {type MouseEventHandler, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import {useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";

interface Props {
    question: Question
    isMissionOwner: boolean
    onEdit: (question: Question) => void
    onDelete: (id: string) => void
}

export default function ({question, isMissionOwner, onEdit, onDelete}: Props) {
    const auth = useAppSelector(selectAuth)

    const [answer, setAnswer] = useState<string>(question.answer || '');
    const [error, setError] = useState<Error>()
    const handleAnswer: MouseEventHandler<HTMLButtonElement> = () => {
        axios.put<Question>(`/missions/questions/${question.id}`, {answer})
            .then(res => {
                if (res.status === 200) {
                    onEdit(res.data)
                    setError(undefined)
                }
            }).catch(err => setError(err as Error))
    }

    const [editQuestion, setEditQuestion] = useState(question.text)
    const handleQuestion: MouseEventHandler<HTMLButtonElement> = () => {
        axios.put<Question>(`/missions/questions/${question.id}`, {text: editQuestion})
            .then(res => {
                if (res.status === 200) {
                    onEdit(res.data)
                    setError(undefined)
                }
            }).catch(err => setError(err as Error))
    }

    const handleDelete: MouseEventHandler<HTMLButtonElement> = () => {
        axios.delete(`/missions/questions/${question.id}`)
            .then(res => {
                if (res.status === 204) {
                    onDelete(question.id)
                    setError(undefined)
                }
            }).catch(err => setError(err as Error))
    }

    const [edit, setEdit] = useState(false)

    return (
        <Card>
            <Text>Q: {question.text}</Text>
            {question.answer && <>
                <Separator size='4' my='2'/>
                <Text>A: {question.answer}</Text>
            </>
            }
            {isMissionOwner
                ? !question.answer
                    ? <>
                        <Separator size='4' my='2'/>
                        <Flex gap='3'>
                            <Box width='100%'>
                                <TextField.Root
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                />
                            </Box>
                            <Button onClick={handleAnswer}>Answer</Button>
                            <Button onClick={handleDelete} color='red'>Delete</Button>
                        </Flex>
                    </>
                    : <>
                        <Separator size='4' my='2'/>
                        {edit
                            ? <>
                                <TextField.Root
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                />
                                <Button onClick={handleAnswer}>Submit</Button>
                            </>
                            : <Flex gap='2'>
                                <Button onClick={() => setEdit(true)}>Edit answer</Button>
                                <Button onClick={handleDelete} color='red'>Delete question</Button>
                            </Flex>
                        }
                    </>
                : auth.id === question.creatorId &&
                <>
                    <Separator size='4' my='2'/>
                    {edit
                        ? <Flex gap='2'>
                            <TextField.Root
                                value={editQuestion}
                                onChange={
                                    (e) => setEditQuestion(e.target.value)
                                }
                            />
                            <Button onClick={handleQuestion}>Submit</Button>
                        </Flex>
                        : <>
                            <Flex gap='2'>
                                <Button onClick={() => setEdit(true)}>Edit</Button>
                                <Button onClick={handleDelete} color='red'>Delete</Button>
                            </Flex>
                        </>
                    }
                </>
            }
            {!!error && <ErrorHandler error={error}/>}
        </Card>
    )
}