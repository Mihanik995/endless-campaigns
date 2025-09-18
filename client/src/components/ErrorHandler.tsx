import { Callout } from "@radix-ui/themes";
import {InfoCircledIcon} from "@radix-ui/react-icons";

interface Props {
    error: Error
}

export default function ({error}: Props) {
    return (
        <Callout.Root color='red'>
            <Callout.Icon>
                <InfoCircledIcon/>
            </Callout.Icon>
            <Callout.Text>
                {error.message}
            </Callout.Text>
        </Callout.Root>
    )
}