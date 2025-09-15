import {Text, TextField} from "@radix-ui/themes";
import {type ChangeEvent, type ReactElement} from "react";

interface Props {
    label: string,
    name: string,
    value: string,
    type?: "number" | "search" | "time" | "text" | "hidden" | "tel" | "url" | "email" | "date" | "datetime-local" | "month" | "password" | "week",
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    icon: ReactElement
}

export default function (props: Props): ReactElement {
    const {label, name, value, onChange, icon, type} = props;

    return (
        <Text as='label' size='5'>
            {label}:{' '}
            <TextField.Root
                name={name}
                value={value}
                type={type || 'text'}
                onChange={onChange}
                size='3'
            >
                <TextField.Slot>
                    {icon}
                </TextField.Slot>
            </TextField.Root>
        </Text>
    )
}