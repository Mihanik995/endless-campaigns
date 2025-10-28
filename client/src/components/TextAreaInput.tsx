import {Flex, Text, TextArea} from "@radix-ui/themes";
import {type ReactElement} from "react";
import {type Control, Controller} from "react-hook-form";

interface Props {
    label: string
    name: string
    control: Control<any>
}

export default function ({label, name, control}: Props): ReactElement {
    return (
        <Text as='label' size='4'>
            <Flex direction='column' gap='1'>
                {label}:{' '}
                <Controller
                    name={name}
                    control={control}
                    rules={{required: 'This field is required!'}}
                    render={({field, fieldState}) =>
                        <Flex direction='column' gap='1'>
                            <TextArea
                                name={name}
                                value={field.value}
                                onChange={field.onChange}
                                size='3'
                                variant='soft'
                                color={fieldState.error ? 'red' : undefined}
                            />
                            {!!fieldState.error &&
                                <Text color='red' size='1'>{fieldState.error.message}</Text>
                            }
                        </Flex>}
                />
            </Flex>
        </Text>
    )
}