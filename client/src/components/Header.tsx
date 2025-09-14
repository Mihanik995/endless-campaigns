import {useNavigate} from "react-router";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {logout, selectAuth} from "../app/features/auth/authSlice.ts";
import axios from "../axios/axiosConfig.ts";
import {Avatar, DropdownMenu, Flex, Heading, IconButton} from "@radix-ui/themes";
import {CheckIcon, Cross2Icon, HamburgerMenuIcon, PersonIcon} from "@radix-ui/react-icons";

export default function () {
    const navigate = useNavigate()
    const auth = useAppSelector(selectAuth);

    const dispatch = useAppDispatch();

    return (
        <Flex
            position='fixed'
            top='0'
            left='0'
            width='100vw'

            py='3'
            px='5'

            gap='3'
            justify='between'
            align='center'
            className='bg-white shadow-xl z-20'
        >
            <Flex
                gap='2'
                align='center'
                onClick={() => navigate('/')}
                className='cursor-pointer'
            >
                <Avatar fallback='EC' src='/logo.png'/>
                <Heading>Endless Campaigns</Heading>
            </Flex>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <IconButton variant='solid' size='3' radius='full'>
                        <HamburgerMenuIcon/>
                    </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    {auth.token
                        ? <DropdownMenu.Item
                            color='red'
                            onClick={() => {
                                axios.post('/auth/logout')
                                    .then(response => {
                                        if (response.status === 200) {
                                            dispatch(logout());
                                        }
                                    }).catch(error => console.log(error))
                            }}
                        >
                            <Cross2Icon/>Log Out
                        </DropdownMenu.Item>
                        : <>
                            <DropdownMenu.Item onClick={() => navigate('/auth/signup')}>
                                <PersonIcon/>Sign Up
                            </DropdownMenu.Item>
                            <DropdownMenu.Item onClick={() => navigate('/auth/login')}>
                                <CheckIcon/>Sign In
                            </DropdownMenu.Item>
                        </>
                    }
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </Flex>
    )
}