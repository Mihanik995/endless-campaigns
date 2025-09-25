import {Flex, Switch, Text} from "@radix-ui/themes";

interface Props {
    name: string;
    value: number;
    onClick: () => void;
    label: string;
    disabled?: boolean;
}

export default function ({name, value, onClick, label, disabled}: Props) {
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
                </Flex>
            </Text>
        </div>
    )
}