import {type Control, Controller} from "react-hook-form";
import {CheckboxCards, Flex, Text} from "@radix-ui/themes";

interface Value {
    value: string
    title: string
    details?: string
}

interface Props {
    name: string
    control: Control<any>
    values: Value[]
    rules?: object
}

export default function ({name, control, values, rules}: Props) {
    return <Controller
        name={name}
        control={control}
        rules={rules}
        render={({field}) => (
            <CheckboxCards.Root
                value={field.value}
                onValueChange={field.onChange}
                columns={{
                    initial: '1',
                    xs: values.length > 2 ? '2' : `${values.length}`,
                    sm: values.length > 3 ? '3' : `${values.length}`
                }}
            >
                {values.map((value, id) => (
                    <CheckboxCards.Item value={value.value} key={id}>
                        <Flex direction='column' width='100%'>
                            <Text weight='bold'>{value.title}</Text>
                            {value.details && <Text>{value.details}</Text>}
                        </Flex>
                    </CheckboxCards.Item>
                ))}
            </CheckboxCards.Root>
        )}
    />
}