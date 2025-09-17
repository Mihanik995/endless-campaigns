import {Flex, Text, TextArea} from "@radix-ui/themes";
import {type ChangeEvent, type ReactElement} from "react";

interface Props {
    label: string,
    name: string,
    value: string,
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void,
}

export default function (props: Props): ReactElement {
    const {label, name, value, onChange} = props;

    return (
        <Text as='label' size='4'>
            <Flex direction='column' gap='1'>
                {label}:{' '}
                <TextArea
                    name={name}
                    value={value}
                    onChange={onChange}
                    size='3'
                />
            </Flex>
        </Text>
    )
}