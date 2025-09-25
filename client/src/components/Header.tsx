import {Box, Flex, Theme} from "@radix-ui/themes";
import Logo from "./Logo.tsx";
import ThemeSelector from "./ThemeSelector.tsx";
import HeaderMenu from "./HeaderMenu.tsx";
import {Portal} from "radix-ui";

export default function () {
    return (
        <Portal.Root>
            <Theme>
                <Box
                    position='fixed'
                    top='0'
                    left='0'
                    width='100vw'
                >
                    <Flex
                        justify='between'
                        align='center'

                        py="4"
                        px={{
                            initial: '3',
                            xs: '6'
                        }}
                        className='shadow-2xl z-20 backdrop-blur-2xl'
                    >
                        <Logo/>
                        <Flex gap='2' align='center'>
                            <ThemeSelector/>
                            <HeaderMenu/>
                        </Flex>
                    </Flex>
                </Box>
            </Theme>
        </Portal.Root>
    )
}