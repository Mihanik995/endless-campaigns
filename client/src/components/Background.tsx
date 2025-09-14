import type {ReactNode} from "react";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {selectTheme} from "../app/features/theme/themeSlice.ts";
import {store} from "../app/store.ts";
import {Theme} from "@radix-ui/themes";

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