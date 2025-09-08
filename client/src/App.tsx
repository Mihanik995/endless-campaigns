import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios, {type AxiosResponse} from 'axios'

type Res = {
    msg: string
}

function App() {
    const [count, setCount] = useState(0)
    const [serverResponse, setServerResponse] = useState<null | Res>(null)

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL as string}/api`)
            .then((res: AxiosResponse<Res, any>) => setServerResponse(res.data))
            .catch(err => console.log(err))
    }, [])

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo"/>
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo"/>
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            {!!serverResponse && <p className="read-the-docs">
                Server response is "{serverResponse.msg}"
            </p>}
        </>
    )
}

export default App
