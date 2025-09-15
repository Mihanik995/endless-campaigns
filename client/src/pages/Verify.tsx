import {type ReactElement, useEffect, useState} from "react";
import axios from "../axios/axiosConfig.ts";
import {useParams} from "react-router";
import Header from "../components/Header.tsx";
import {Heading, Text} from "@radix-ui/themes";

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
                    <Heading>Your verification passed successfully!</Heading>
                    <Text>You can Log in now!</Text>
                </>
            }
        </>)
}