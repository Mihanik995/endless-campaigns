import {type ChangeEvent, type MouseEventHandler, type ReactElement, useState} from "react";
import Header from "../components/Header.tsx";
import TextInput from "../components/TextInput.tsx";
import Button from "../components/Button.tsx";
import axios from "axios";

interface LoginData {
    username: string;
    password: string;
}

export default function (): ReactElement {
    const [success, setSuccess] = useState(false);
    const [loginData, setLoginData] = useState<LoginData>({
        username: '',
        password: '',
    })

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
        axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
            {username, password},
            {headers: {'Content-Type': 'application/json'}}
        )
            .then(res => {
                if (res.status === 200) {
                    console.log(res.data)
                    setSuccess(true)
                } else {
                    console.log(res.data)
                }
            })
    }

    return (
        <>
            <Header/>
            {success
                ? <h1>You've successfully logged in!</h1>
                : <form>
                    <TextInput type={'text'} name={'username'} required={true} onChange={handleChange}/>
                    <TextInput type={'password'} name={'password'} required={true} onChange={handleChange}/>
                    <Button text={'Login'} onClick={handleSubmit}/>
                </form>}
        </>
    )
}