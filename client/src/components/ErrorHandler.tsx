import {Callout} from "@radix-ui/themes";
import {InfoCircledIcon} from "@radix-ui/react-icons";

interface Props {
    error: any
}

export default function ({error}: Props) {
    console.log(error);

    return (
        <Callout.Root color='red'>
            <Callout.Icon>
                <InfoCircledIcon/>
            </Callout.Icon>
            <Callout.Text>
                Error occurred: {error.response.data.message
                ? error.response.data.message
                : error.message
            }
            </Callout.Text>
        </Callout.Root>
    )
}