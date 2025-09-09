import {type ChangeEvent, type MouseEventHandler, type ReactElement, useState} from "react";
import Header from "../components/Header.tsx";
import TextInput from "../components/TextInput.tsx";
import Button from "../components/Button.tsx";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {login} from "../app/features/auth/authSlice.ts";

interface LoginData {
    username: string;
    password: string;
}

export default function (): ReactElement {
    const [loginData, setLoginData] = useState<LoginData>({
        username: '',
        password: '',
    })

    const auth = useAppSelector(state => state.auth)
    const dispatch = useAppDispatch()

    const handleChange = function (e: ChangeEvent<HTMLInputElement>) {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit: MouseEventHandler<HTMLButtonElement> = function (e) {
        e.preventDefault();
        const {username, password} = loginData;
        if (!(username && password)) {
            alert("Please fill the required fields");
            return;
        }
        dispatch(login({username, password}))
    }

    return (
        <>
            <Header/>
            {auth.success
                ? <h1>You've successfully logged in!</h1>
                : <form>
                    <TextInput type={'text'} name={'username'} required={true} onChange={handleChange}/>
                    <TextInput type={'password'} name={'password'} required={true} onChange={handleChange}/>
                    <Button text={'Login'} onClick={handleSubmit}/>
                </form>}
        </>
    )
}