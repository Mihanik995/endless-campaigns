import {Avatar, Flex, IconButton, Popover, Separator, Switch, Text} from "@radix-ui/themes";
import {ShadowInnerIcon} from "@radix-ui/react-icons";
import {selectTheme, setBackground, toggleTheme} from "../app/features/theme/themeSlice.ts";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";

interface StringMap {
    [key: string]: string;
}

export default function () {
    const theme = useAppSelector(selectTheme);
    const dispatch = useAppDispatch();

    const backgrounds: StringMap = {
        default: '',
        stone: `/assets/stone-${theme.theme}-bg.jpg`,
        metal: `/assets/metal-${theme.theme}-bg.jpg`,
        wood: `/assets/wood-${theme.theme}-bg.jpg`,
        leather: `/assets/leather-${theme.theme}-bg.jpg`,
    }

    return (
        <Popover.Root>
            <Popover.Trigger>
                <IconButton
                    size='3'
                    radius='full'
                >
                    <ShadowInnerIcon/>
                </IconButton>
            </Popover.Trigger>
            <Popover.Content>
                <Text as='label' size='3'>
                    <Switch
                        value={Number(theme.theme === 'light')}
                        onClick={() => dispatch(toggleTheme())}
                    />
                    {' '}Toggle Theme
                </Text>
                <Separator size='4' my='3'/>
                <Flex direction='column' gap='2' align='end'>
                    <Text>Backgrounds</Text>
                    <Flex gap='2' justify='end'>
                        {Object.keys(backgrounds).map((bg) => (
                            <button
                                key={bg}
                                onClick={() => dispatch(setBackground(bg))}
                            >
                                <Avatar
                                    src={backgrounds[bg]}
                                    fallback={bg[0]}
                                    className='cursor-pointer'
                                />
                            </button>
                        ))}
                    </Flex>
                </Flex>
            </Popover.Content>
        </Popover.Root>
    )
}