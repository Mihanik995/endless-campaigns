import {useNavigate} from "react-router";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {logout, selectAuth} from "../app/features/auth/authSlice.ts";
import axios from "../axios/axiosConfig.ts";
import {
    Avatar,
    Box,
    Button,
    DropdownMenu,
    Flex,
    Heading,
    IconButton,
    Popover,
    Separator,
    Switch,
    Text
} from "@radix-ui/themes";
import {CheckIcon, Cross2Icon, HamburgerMenuIcon, PersonIcon, ShadowInnerIcon} from "@radix-ui/react-icons";
import {selectTheme, setBackground, toggleTheme} from "../app/features/theme/themeSlice.ts";
import background from "./Background.tsx";

export default function () {
    const navigate = useNavigate()

    const auth = useAppSelector(selectAuth);
    const theme = useAppSelector(selectTheme);
    const dispatch = useAppDispatch();

    const backgrounds = {
        default: '',
        stone: `/assets/stone-${theme.theme}-bg.jpg`,
        metal: `/assets/metal-${theme.theme}-bg.jpg`,
        wood: `/assets/wood-${theme.theme}-bg.jpg`,
        leather: `/assets/leather-${theme.theme}-bg.jpg`,
    }

    return (
        <Box
            position='fixed'
            top='0'
            left='0'
            width='100vw'
        >
            <Flex
                gap='3'
                justify='between'
                align='center'

                p="5"
                className='shadow-2xl z-20 backdrop-blur-2xl'
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
                <Flex gap='2' align='center'>
                    <Popover.Root>
                        <Popover.Trigger>
                            <IconButton
                                size='3'
                                radius='full'
                            >
                                <ShadowInnerIcon/>
                            </IconButton>
                        </Popover.Trigger>
                        <Popover.Content>
                            <Text as='label' size='3'>
                                <Switch
                                    value={theme.theme === 'light'}
                                    onClick={() => dispatch(toggleTheme())}
                                />
                                {' '}Toggle Theme
                            </Text>
                            <Separator size='4' my='3'/>
                            <Flex direction='column' gap='2' align='end'>
                                <Text>Backgrounds</Text>
                                <Flex gap='2' justify='end'>
                                    {Object.keys(backgrounds).map((bg) => (
                                        <button
                                            key={bg}
                                            onClick={() => dispatch(setBackground(bg))}
                                        >
                                            <Avatar
                                                src={backgrounds[bg]}
                                                fallback={bg[0]}
                                                className='cursor-pointer'
                                            />
                                        </button>
                                    ))}
                                </Flex>
                            </Flex>
                        </Popover.Content>
                    </Popover.Root>
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
            </Flex>
        </Box>
    )
}