import {type ReactNode} from "react";
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

    return (
        <div
            className={backgroundClass}
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