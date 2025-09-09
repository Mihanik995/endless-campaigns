import {type ChangeEvent, type MouseEventHandler, type ReactElement, useState} from "react";
import TextInput from "../components/TextInput.tsx";
import Header from "../components/Header.tsx";
import Button from "../components/Button.tsx";
import axios from "axios";

interface RegisterData {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
}

export default function (): ReactElement {
    const [registerData, setRegisterData] = useState<RegisterData>({
        username: '',
        password: '',
        confirmPassword: '',
        email: ''
    })

    const handleChange = function (e: ChangeEvent<HTMLInputElement>) {
        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit: MouseEventHandler<HTMLButtonElement> = function (e) {
        e.preventDefault();
        const {username, password, confirmPassword, email} = registerData;
        if (!(username && password && confirmPassword && email)) {
            alert("Please fill the required fields");
            return;
        }
        if (password !== confirmPassword) {
            alert("Password must match");
            return;
        }
        axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
            {username, password, email},
            {headers: {'Content-Type': 'application/json'}}
        )
            .then(res => {
                if (res.status === 201) {
                    setSuccess(true)
                } else {
                    console.log(res.data)
                }
            })
    }

    const [success, setSuccess] = useState(false)

    return (
        <>
            <Header/>
            {success
                ? <h1>You've registered successfully!</h1>
                : <form>
                <TextInput onChange={handleChange} type={'text'} name={'username'} required={true}/>
                <TextInput onChange={handleChange} type={'password'} name={'password'} required={true}/>
                <TextInput onChange={handleChange} type={'password'} name={'confirmPassword'} required={true}/>
                <TextInput onChange={handleChange} type={'email'} name={'email'} required={true}/>
                <Button text={'Submit'} onClick={handleSubmit}/>
            </form>}
        </>
    )
}