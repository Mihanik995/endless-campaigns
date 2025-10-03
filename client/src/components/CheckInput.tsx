import {Flex, IconButton, Popover, Switch, Text} from "@radix-ui/themes";
import {QuestionMarkIcon} from "@radix-ui/react-icons";
import type {ReactElement} from "react";

interface Props {
    name: string;
    value: number;
    onClick: () => void;
    label: string;
    disabled?: boolean;
    hint?: ReactElement;
}

export default function ({name, value, onClick, label, disabled, hint}: Props) {
    return (
        <div className='isolate'>
            <Text as='label' size='3'>
                <Flex gap='2' align='center'>
                    <Switch
                        disabled={disabled || false}
                        defaultChecked={value !== 0}
                        name={name}
                        value={value}
                        onClick={onClick}
                        size='3'
                        color='grass'
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