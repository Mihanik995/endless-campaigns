import Button from "./Button.tsx";
import {useNavigate} from "react-router";
import {useAppDispatch} from "../app/hooks.ts";
import {logout} from "../app/features/auth/authSlice.ts";
import axios from "../axios/axiosConfig.ts";

export default function () {
    const navigate = useNavigate()

    const dispatch = useAppDispatch();

    return (
        <div className={
            `fixed top-0 left-0 w-full z-50 
            flex items-center justify-center gap-2 
            bg-gray-600 p-4`
        }>
            <Button text='Home' onClick={() => navigate('/')} />
            <Button text='Sign Up' onClick={() => navigate('/auth/signup')} />
            <Button text='Log in' onClick={() => navigate('/auth/login')} />
            <Button text='Log out' onClick={() => {
                axios.post('/auth/logout')
                .then(response => {
                    if (response.status === 200) {
                        dispatch(logout());
                    }
                }).catch(error => console.log(error))}}/>
        </div>
    )
}