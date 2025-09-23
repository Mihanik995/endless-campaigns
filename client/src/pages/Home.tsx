import Header from "../components/Header.tsx";
import {useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";
import {Navigate} from "react-router";

export default function CreateCampaignForm() {
    const auth = useAppSelector(selectAuth)

    return auth.token
        ? <Navigate to={'/dashboard'} replace/>
        : <>
            <Header/>
        </>
}
