import {Avatar, Flex, Heading} from "@radix-ui/themes";
import {useNavigate} from "react-router";

export default function () {
    const navigate = useNavigate()

    return (
        <Flex
            gap='2'
            align='center'
            onClick={() => navigate('/')}
            className='cursor-pointer'
        >
            <Avatar fallback='EC' src='/logo.png'/>
            <Heading>Endless Campaigns</Heading>
        </Flex>
    )
}