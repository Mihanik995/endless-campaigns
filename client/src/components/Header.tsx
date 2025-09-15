import {Box, Flex} from "@radix-ui/themes";
import Logo from "./Logo.tsx";
import ThemeSelector from "./ThemeSelector.tsx";
import HeaderMenu from "./HeaderMenu.tsx";

export default function () {
    return (
        <Box
            position='fixed'
            top='0'
            left='0'
            width='100vw'
        >
            <Flex
                gap='3'
                justify='between'
                align='center'

                p="5"
                className='shadow-2xl z-20 backdrop-blur-2xl'
            >
                <Logo/>
                <Flex gap='2' align='center'>
                    <ThemeSelector/>
                    <HeaderMenu/>
                </Flex>
            </Flex>
        </Box>
    )
}