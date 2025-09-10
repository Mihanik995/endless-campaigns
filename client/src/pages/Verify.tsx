import {type ReactElement, useEffect, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import {useParams} from "react-router";
import Header from "../components/Header.tsx";

export default function (): ReactElement {
    const [success, setSuccess] = useState(false)
    const {token} = useParams();

    useEffect(() => {
        axios.get(`/auth/verify/${token}`)
            .then(res => {
                if (res.status === 200) {
                    setSuccess(true);
                }
            }).catch(err => console.log(err))
    }, [])

    return (
        <>
            <Header/>
            {success &&
                <>
                    <h1>Your verification passed successfully!</h1>
                    <p>You can Log in now!</p>
                </>
            }
        </>)
}