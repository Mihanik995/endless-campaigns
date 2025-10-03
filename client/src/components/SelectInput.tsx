import {Flex, IconButton, Popover, Select} from "@radix-ui/themes";
import {QuestionMarkIcon} from "@radix-ui/react-icons";
import {type ReactElement} from "react";

interface Props {
    label?: string
    value: string
    onValueChange: (value: string) => void
    options: { [key: string]: string }
    placeholder?: string
    hint?: ReactElement
    size?: '1' | '2' | '3'
}

export default function ({label, value, onValueChange, options, placeholder, hint, size}: Props) {
    return <Flex gap='1' direction='column'>
        {!!label && `${label}:`}
        <Flex gap='2' align='center'>
            <Select.Root
                value={value}
                onValueChange={onValueChange}
                size={size || '3'}
            >
                <Select.Trigger placeholder={placeholder}/>
                <Select.Content>
                    {Object.entries(options).map(([key, value], index) => (
                        <Select.Item key={index} value={key}>{value}</Select.Item>
                    ))}
                </Select.Content>
            </Select.Root>
            {hint &&
                <Popover.Root>
                    <Popover.Trigger>
                        <IconButton radius='full' variant='outline' size='1'>
                            <QuestionMarkIcon/>
                        </IconButton>
                    </Popover.Trigger>
                    <Popover.Content maxWidth='60vw'>
                        {hint}
                    </Popover.Content>
                </Popover.Root>
            }
        </Flex>
    </Flex>
}