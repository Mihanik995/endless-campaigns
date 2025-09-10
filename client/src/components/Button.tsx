import type {MouseEventHandler, ReactElement} from "react";

interface Props {
    text: string,
    onClick: MouseEventHandler<HTMLButtonElement>
}

export default function (children: Props): ReactElement {
    return (
        <button className={
            `px-2 py-1 text-yellow-300 font-serif tracking-wide
            hover:text-yellow-600 transition-colors duration-300 ease-in-out`
        } onClick={children.onClick}>
            {children.text}
        </button>
    )
}