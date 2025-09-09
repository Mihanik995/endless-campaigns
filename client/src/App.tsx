import {useEffect, useState} from 'react'
import './App.css'
import Header from './components/Header'

import {useAppSelector} from "./app/hooks.ts";
import axios from './axios/axiosConfig.ts'

function App() {
    const [count, setCount] = useState(0)
    const [test, setTest] = useState()

    const auth = useAppSelector(state => state.auth)

    useEffect(() => {
        axios.get(`/test`, {})
            .then(res => setTest(res.data.message))
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
            {!!test && <h1>{test}</h1>}
        </>
    )
}

export default App
