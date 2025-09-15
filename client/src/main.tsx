import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import Home from './pages/Home'
import {BrowserRouter, Route, Routes} from "react-router";
import Signup from "./pages/Signup.tsx";
import Login from "./pages/Login.tsx";
import {store} from './app/store.ts'
import {Provider} from 'react-redux'
import Verify from "./pages/Verify.tsx";
import "@radix-ui/themes/styles.css";
import './index.css'
import Background from "./components/Background.tsx";
import ProtectedRoute from "./utils/ProtectedRoute.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <Background>
                <BrowserRouter>
                    <Routes>
                        <Route index element={<Home/>}/>
                        <Route path='auth'>
                            <Route path='signup' element={<Signup/>}/>
                            <Route path='login' element={<Login/>}/>
                            <Route path='verify/:token' element={<Verify/>}/>
                        </Route>
                        <Route element={<ProtectedRoute/>}>

                        </Route>
                    </Routes>
                </BrowserRouter>
            </Background>
        </Provider>
    </StrictMode>,
)
