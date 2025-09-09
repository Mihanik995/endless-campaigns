import Button from "./Button.tsx";
import {useNavigate} from "react-router";

export default function () {
    const navigate = useNavigate()

    return (
        <div className={
            `fixed top-0 left-0 w-full z-50 
            flex items-center justify-center gap-2 
            bg-gray-600 p-4`
        }>
            <Button text='Sign Up' onClick={() => navigate('/auth/signup')} />
            <Button text='Login' onClick={() => navigate('/auth/login')} />
        </div>
    )
}