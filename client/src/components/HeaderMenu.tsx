import {DropdownMenu, IconButton} from "@radix-ui/themes";
import {DashboardIcon, EnterIcon, ExitIcon, HamburgerMenuIcon, PersonIcon} from "@radix-ui/react-icons";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {logout, selectAuth} from "../app/features/auth/authSlice.ts";
import {useNavigate} from "react-router";

import axios from "../axios/axiosConfig.ts"

export default function () {
    const auth = useAppSelector(selectAuth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <IconButton variant='solid' size='3' radius='full'>
                    <HamburgerMenuIcon/>
                </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                {auth.token
                    ? <>
                        <DropdownMenu.Item onClick={() => navigate('/profile')}>
                            <PersonIcon/>Profile
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onClick={() => navigate('/dashboard')}>
                            <DashboardIcon/>Dashboard
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator/>
                        <DropdownMenu.Item
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
                            <ExitIcon/>Log Out
                        </DropdownMenu.Item>
                    </>
                    : <>
                        <DropdownMenu.Item onClick={() => navigate('/auth/signup')}>
                            <PersonIcon/>Sign Up
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onClick={() => navigate('/auth/login')}>
                            <EnterIcon/>Sign In
                        </DropdownMenu.Item>
                    </>
                }
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    )
}