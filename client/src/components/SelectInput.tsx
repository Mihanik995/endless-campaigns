import {Flex, IconButton, Popover, Select, Text} from "@radix-ui/themes";
import {QuestionMarkIcon} from "@radix-ui/react-icons";
import {type ReactElement} from "react";
import {type Control, Controller} from "react-hook-form";

interface Props {
    label?: string
    name: string
    control: Control<any>
    options: { [key: string]: string }
    placeholder?: string
    hint?: ReactElement
    size?: '1' | '2' | '3'
}

export default function ({label, name, control, options, placeholder, hint, size}: Props) {
    return <Flex gap='1' direction='column'>
        {!!label && `${label}:`}
        <Flex gap='2'>
            <Controller
                name={name}
                control={control}
                rules={{required: 'This field is required'}}
                render={({field, fieldState}) =>
                    <Flex direction='column' gap='1'>
                        <Select.Root
                            value={field.value}
                            onValueChange={field.onChange}
                            size={size || '3'}
                        >
                            <Select.Trigger placeholder={placeholder}/>
                            <Select.Content onBlur={field.onBlur} color={fieldState.error ? 'red' : undefined}>
                                {Object.entries(options).map(([key, value], index) => (
                                    <Select.Item key={index} value={key}>{value}</Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Root>
                        {!!fieldState.error &&
                            <Text size='1' color='red'>{fieldState.error.message}</Text>
                        }
                    </Flex>}
            />
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