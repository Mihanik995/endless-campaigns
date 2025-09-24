import type {Question} from "../types.ts";
import {Button, Card, Flex, Separator, Text, TextField} from "@radix-ui/themes";
import {type MouseEventHandler, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import ErrorHandler from "./ErrorHandler.tsx";
import {useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";

interface Props {
    question: Question
    isMissionOwner: boolean
    onChange: () => void
}

export default function ({question, isMissionOwner, onChange}: Props) {
    const auth = useAppSelector(selectAuth)

    const [answer, setAnswer] = useState<string>(question.answer || '');
    const [error, setError] = useState<Error>()
    const handleAnswer: MouseEventHandler<HTMLButtonElement> = () => {
        axios.put(`/missions/questions/${question.id}`, {answer})
            .then(res => {
                if (res.status === 200) onChange()
            }).catch(err => setError(err as Error))
    }

    const [editQuestion, setEditQuestion] = useState(question.text)
    const handleQuestion: MouseEventHandler<HTMLButtonElement> = () => {
        axios.put(`/missions/questions/${question.id}`, {text: editQuestion})
            .then(res => {
                if (res.status === 200) onChange()
            }).catch(err => setError(err as Error))
    }

    const handleDelete: MouseEventHandler<HTMLButtonElement> = () => {
        axios.delete(`/missions/questions/${question.id}`)
            .then(res => {
                if (res.status === 204) onChange()
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
                            <TextField.Root
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                            />
                            <Button onClick={handleAnswer}>Answer</Button>
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
                                <Button onClick={handleAnswer}>Answer</Button>
                            </>
                            : <Button onClick={() => setEdit(true)}>Edit answer</Button>
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
                            <Button onClick={handleQuestion}>Answer</Button>
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