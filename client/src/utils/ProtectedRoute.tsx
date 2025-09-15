import {useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";
import {Navigate, Outlet} from "react-router";

export default function () {
    const auth = useAppSelector(selectAuth);
    console.log(auth.token);

    if (!auth.token) {
        return <Navigate to='/auth/login' replace/>
    }
    return <Outlet/>
}