import type {MouseEventHandler, ReactElement} from "react";

interface Props {
    text: string,
    onClick: MouseEventHandler<HTMLButtonElement>
}

export default function (children: Props): ReactElement {
    return (
        <button className={
            `p-2 border-2 border-r-2 border-black`
        } onClick={children.onClick}>
            {children.text}
        </button>
    )
}