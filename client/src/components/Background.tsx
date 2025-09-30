import {type ReactNode, useEffect, useState} from "react";
import {Theme} from "@radix-ui/themes";

import {useAppSelector} from "../app/hooks.ts";
import {selectTheme} from "../app/features/theme/themeSlice.ts";

interface Props {
    children: ReactNode;
}

export default function ({children}: Props) {
    const theme = useAppSelector(selectTheme)
    const backgroundClass = theme.background === 'default'
        ? `bg-default-${theme.theme}`
        : `bg ${theme.background}-${theme.theme}`

    const [isBgLoaded, setIsBgLoaded] = useState(false)
    useEffect(() => {
        setIsBgLoaded(false)
        const img = new Image()
        img.src = `/assets/${theme.background}-${theme.theme}-bg.jpg`
        img.onload = () => setIsBgLoaded(true)
    }, [backgroundClass])

    return (
        <div
            className={isBgLoaded ? backgroundClass : `bg-default-${theme.theme}`}
        >
            <Theme
                appearance={theme.theme}
                accentColor="gray"
                grayColor="mauve"
                radius="large"
                hasBackground={false}
            >
                {children}
            </Theme>
        </div>
    )
}