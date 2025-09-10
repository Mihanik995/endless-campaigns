import {useEffect, useState} from 'react'
import './App.css'
import Header from './components/Header'

import {useAppSelector} from "./app/hooks.ts";
import axios from './axios/axiosConfig.ts'
import Button from "./components/Button.tsx";

function App() {
    const [count, setCount] = useState(0)
    const [authTest, setAuthTest] = useState()
    const [emailTest, setEmailTest] = useState(false)

    const auth = useAppSelector(state => state.auth)

    useEffect(() => {
        axios.get(`/test`, {})
            .then(res => setAuthTest(res.data.message))
            .catch((err: Error) => console.error(err))
    }, [auth])

    return (
        <>
            <Header/>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
            </div>
            {!!authTest && <h1>{authTest}</h1>}
            {emailTest
                ? <h1>Email sent successfully!</h1>
                : <Button text={'Send test e-mail'} onClick={() => {
                    axios.post('/send-me-email')
                        .then(res => {
                            if (res.status === 200) {
                                setEmailTest(true)
                            }
                        })
                }}/>}
        </>
    )
}

export default App
