import {createSlice} from "@reduxjs/toolkit";
import type {RootState} from "../../store.ts";

export interface ThemeState {
    theme: 'dark' | 'light';
    background: 'leather' | 'wood' | 'stone' | 'metal' | 'default'
}

const initialState: ThemeState = {
    theme: localStorage.getItem('endless_campaigns_theme') as ThemeState["theme"] || 'light',
    background: localStorage.getItem('endless_campaigns_bg') as ThemeState["background"] || 'default'
}

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('endless_campaigns_theme', state.theme);
        },
        setBackground: (state, action) => {
            state.background = action.payload;
            localStorage.setItem('endless_campaigns_bg', state.background);
        }
    }
})

export const {toggleTheme, setBackground} = themeSlice.actions;
export const selectTheme = (state: RootState) => state.theme
export default themeSlice.reducer;