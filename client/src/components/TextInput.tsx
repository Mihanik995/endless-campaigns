import {Flex, IconButton, Popover, Text, TextField} from "@radix-ui/themes";
import {type ChangeEvent, type ReactElement} from "react";
import {QuestionMarkIcon} from "@radix-ui/react-icons";

interface Props {
    label: string,
    name: string,
    value: string,
    type?: "number" | "search" | "time" | "text" | "hidden" | "tel" | "url" | "email" | "date" | "datetime-local" | "month" | "password" | "week",
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    icon?: ReactElement,
    placeholder?: string
    required?: boolean
    hint?: string
}

export default function (props: Props): ReactElement {
    const {label, name, value, onChange, icon, type, placeholder, required, hint} = props;

    return (
        <Text as='label' size='3'>
            <Flex direction='column' gap='1'>
                {label}:
                <Flex gap='2'>
                    <TextField.Root
                        name={name}
                        value={value}
                        type={type || 'text'}
                        onChange={onChange}
                        size='3'
                        placeholder={placeholder}
                        required={required || true}
                    >
                        {!!icon &&
                            <TextField.Slot>
                                {icon}
                            </TextField.Slot>
                        }
                    </TextField.Root>
                    {hint &&
                        <Popover.Root>
                            <Popover.Trigger>
                                <IconButton radius='full' variant='outline'>
                                    <QuestionMarkIcon/>
                                </IconButton>
                            </Popover.Trigger>
                            <Popover.Content>
                                <Text>{hint}</Text>
                            </Popover.Content>
                        </Popover.Root>}
                </Flex>
            </Flex>
        </Text>
    )
}