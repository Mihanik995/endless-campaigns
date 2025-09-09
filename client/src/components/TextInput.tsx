import type {ChangeEvent, ReactElement} from "react";

interface Props {
    placeholder?: string,
    name: string,
    type: 'text' | 'password' | 'email',
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    required: boolean,
}

export default function (props: Props): ReactElement {
    return (
        <div>
            <label
                className={
                    `text-xl font-semibold`
                }>
                {props.name[0].toUpperCase() + props.name.slice(1)}{props.required && '*'}:
                <input
                    className={
                        `p-2 border-2 border-black border-r-2`
                    }
                    type={props.type}
                    onChange={props.onChange}
                    placeholder={props.placeholder}
                    name={props.name}
                    required={props.required}
                />
            </label>
        </div>
    )
}