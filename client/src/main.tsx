import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Routes, Route} from "react-router";
import Signup from "./pages/Signup.tsx";
import Login from "./pages/Login.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <Routes>
            <Route index element={<App/>}/>
            <Route path='auth'>
                <Route path='signup' element={<Signup/>}/>
                <Route path='login' element={<Login/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
  </StrictMode>,
)
