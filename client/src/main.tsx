import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from "react-router";
import Signup from "./pages/Signup.tsx";
import Login from "./pages/Login.tsx";
import {store} from './app/store.ts'
import {Provider} from 'react-redux'
import Verify from "./pages/Verify.tsx";
import "@radix-ui/themes/styles.css";
import './index.css'
import Background from "./components/Background.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <Background>
                {/*<ThemePanel/>*/}
                <BrowserRouter>
                    <Routes>
                        <Route index element={<App/>}/>
                        <Route path='auth'>
                            <Route path='signup' element={<Signup/>}/>
                            <Route path='login' element={<Login/>}/>
                            <Route path='verify/:token' element={<Verify/>}/>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </Background>
        </Provider>
    </StrictMode>,
)
