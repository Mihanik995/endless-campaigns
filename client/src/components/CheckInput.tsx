import {Flex, Switch, Text} from "@radix-ui/themes";

interface Props {
    name: string;
    value: number;
    onClick: () => void;
    label: string;
}

export default function ({name, value, onClick, label}: Props) {
    return (
        <Text as='label' size='3'>
            <Flex gap='2'>
                <Switch
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
    )
}