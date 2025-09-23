import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Route, Routes} from "react-router";

import Home from './pages/Home'
import Signup from "./pages/Signup.tsx";
import Login from "./pages/Login.tsx";
import {store} from './app/store.ts'
import {Provider} from 'react-redux'
import Verify from "./pages/Verify.tsx";
import Background from "./components/Background.tsx";
import ProtectedRoute from "./utils/ProtectedRoute.tsx";
import Dashboard from "./pages/Dashboard.tsx";

import "@radix-ui/themes/styles.css";
import './index.css'
import CreateCampaign from "./pages/CreateCampaign.tsx";
import CampaignPage from "./pages/CampaignPage.tsx";
import UserProfile from "./pages/UserProfile.tsx";
import CreateMission from "./pages/CreateMission.tsx";
import MissionPage from "./pages/MissionPage.tsx";
import PlayPairing from "./pages/PlayPairing.tsx";

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
                            <Route path='profile' element={<UserProfile/>}>
                                <Route path=':id' element={<UserProfile/>}/>
                            </Route>
                            <Route path='dashboard' element={<Dashboard/>}/>
                            <Route path='campaigns'>
                                <Route path='new' element={<CreateCampaign/>}/>
                                <Route path=':id' element={<CampaignPage/>}/>
                            </Route>
                            <Route path='missions'>
                                <Route path='new' element={<CreateMission/>}/>
                                <Route path=':id' element={<MissionPage/>}/>
                            </Route>
                            <Route path='pairings'>
                                <Route path={':id'} element={<PlayPairing/>}/>
                            </Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </Background>
        </Provider>
    </StrictMode>,
)
