import {Avatar, Flex, IconButton, Popover, Separator, Spinner, Switch, Text} from "@radix-ui/themes";
import {MoonIcon, SunIcon} from "@radix-ui/react-icons";
import {selectTheme, setBackground, toggleTheme} from "../app/features/theme/themeSlice.ts";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {useEffect, useState} from "react";

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

    const [loaded, setLoaded] = useState<Record<string, boolean>>({});
    useEffect(() => {
        Object.entries(backgrounds).forEach(([key, url]) => {
            if (!url || loaded[key]) return;

            const img = new Image();
            img.src = url;
            img.onload = () => {
                setLoaded(prev => ({...prev, [key]: true}));
            };
        });
    }, [theme.theme]);

    return (
        <Popover.Root>
            <Popover.Trigger>
                <IconButton
                    size='3'
                    radius='full'
                >
                    {theme.theme === 'light'
                        ? <SunIcon/>
                        : <MoonIcon/>}
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
                        {Object.keys(backgrounds).map((bg) => loaded[bg] || bg === 'default'
                            ? <button
                                key={bg}
                                onClick={() => {
                                    if (loaded[bg] || bg === 'default') dispatch(setBackground(bg))
                                }}
                                style={{width: 40, height: 40, alignContent: 'center'}}
                            >
                                <Avatar
                                    src={backgrounds[bg]}
                                    fallback={bg[0]}
                                    className='cursor-pointer'
                                />
                            </button>
                            : <Flex height='40px' width='40px' justify='center' align='center'>
                                <Spinner size='2'/>
                            </Flex>
                        )}
                    </Flex>
                </Flex>
            </Popover.Content>
        </Popover.Root>
    )
}