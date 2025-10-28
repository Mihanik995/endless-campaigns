import {Flex, IconButton, Popover, Text, TextField} from "@radix-ui/themes";
import {type ReactElement} from "react";
import {QuestionMarkIcon} from "@radix-ui/react-icons";
import {type Control, Controller} from "react-hook-form";

interface Props {
    label: string,
    name: string,
    type?: "number" | "search" | "time" | "text" | "hidden" | "tel" | "url" | "email" | "date" | "datetime-local" | "month" | "password" | "week",
    icon?: ReactElement,
    placeholder?: string
    required?: boolean
    hint?: ReactElement
    control: Control<any>
}

export default function ({label, name, control, icon, type, placeholder, required, hint}: Props): ReactElement {
    return (
        <Text as='label' size='3'>
            <Flex direction='column' gap='1'>
                {label}:
                <Flex gap='2'>
                    <Controller
                        name={name}
                        control={control}
                        rules={{
                            required: required ? undefined : 'This field is required!'
                        }}
                        render={({field, fieldState}) =>
                            <Flex direction='column' gap='1'>
                                <TextField.Root
                                    name={field.name}
                                    value={field.value}
                                    type={type || 'text'}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    ref={field.ref}
                                    size='3'
                                    placeholder={placeholder}
                                    variant='soft'
                                    color={fieldState.error ? 'red' : undefined}
                                >
                                    {!!icon &&
                                        <TextField.Slot>
                                            {icon}
                                        </TextField.Slot>
                                    }
                                </TextField.Root>
                                {!!fieldState.error &&
                                    <Text size='1' color='red' align='right'>{fieldState.error.message}</Text>}
                            </Flex>
                        }
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
                        </Popover.Root>}
                </Flex>
            </Flex>
        </Text>
    )
}