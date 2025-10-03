import {Avatar, Box, Flex, Heading, Theme} from "@radix-ui/themes";
import ThemeSelector from "./ThemeSelector.tsx";
import HeaderMenu from "./HeaderMenu.tsx";
import {Portal} from "radix-ui";
import {useNavigate} from "react-router";
import {useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";

export default function () {
    const auth = useAppSelector(selectAuth)
    const navigate = useNavigate()

    return (
        <>
            <Portal.Root>
                <Theme>
                    <Box
                        position='fixed'
                        top='0'
                        left='0'
                        width='100vw'
                    >
                        <Flex
                            justify='between'
                            align='center'

                            py="4"
                            px={{
                                initial: '3',
                                xs: '6'
                            }}
                            className='shadow-2xl z-20 backdrop-blur-2xl'
                        >
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
                            <Flex gap='2' align='center'>
                                <ThemeSelector/>
                                <HeaderMenu/>
                            </Flex>
                        </Flex>
                    </Box>
                </Theme>
            </Portal.Root>
        </>
    )
}