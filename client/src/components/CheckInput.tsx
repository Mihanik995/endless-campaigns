import {Flex, IconButton, Popover, Switch, Text} from "@radix-ui/themes";
import {QuestionMarkIcon} from "@radix-ui/react-icons";
import type {ReactElement} from "react";
import {type Control, Controller} from "react-hook-form";

interface Props {
    name: string;
    label: string;
    control: Control<any>;
    disabled?: boolean;
    hint?: ReactElement;
}

export default function ({name, label, control, disabled, hint}: Props) {
    return (
        <div className='isolate'>
            <Text as='label' size='3'>
                <Flex gap='2' align='center'>
                    <Controller
                        name={name}
                        control={control}
                        render={({field}) => <Switch
                            disabled={disabled || false}
                            checked={!!field.value}
                            onCheckedChange={field.onChange}
                            name={field.name}
                            size='3'
                            color='grass'
                        />}
                    />
                    {label}
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
            </Text>
        </div>
    )
}