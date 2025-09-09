import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Routes, Route} from "react-router";
import Signup from "./pages/Signup.tsx";
import Login from "./pages/Login.tsx";
import {store} from './app/store.ts'
import {Provider} from 'react-redux'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route index element={<App/>}/>
                    <Route path='auth'>
                        <Route path='signup' element={<Signup/>}/>
                        <Route path='login' element={<Login/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </Provider>
    </StrictMode>,
)
