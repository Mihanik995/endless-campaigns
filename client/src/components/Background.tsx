import type {ReactNode} from "react";

interface Props {
    children: ReactNode;
}

export default function ({children}: Props) {
    return (
        <div className='bg-stone-light'>
            {children}
        </div>
    )
}