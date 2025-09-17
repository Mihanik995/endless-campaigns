import {Avatar, Flex, Heading} from "@radix-ui/themes";
import {useNavigate} from "react-router";
import {useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";

export default function () {
    const auth = useAppSelector(selectAuth)
    const navigate = useNavigate()

    return (
        <Flex
            gap='2'
            align='center'
            onClick={() => auth.token
                ? navigate('/dashboard')
                : navigate('/')}
            className='cursor-pointer'
        >
            <Avatar size={{
                initial: '5',
                xs: '3'
            }} fallback='EC' src='/logo.png'/>
            <Heading>Endless Campaigns</Heading>
        </Flex>
    )
}