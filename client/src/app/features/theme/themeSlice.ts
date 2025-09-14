import {createSlice} from "@reduxjs/toolkit";
import type {RootState} from "../../store.ts";

export interface ThemeState {
    theme: 'dark' | 'light';
    background: 'leather' | 'wood' | 'stone' | 'metal' | 'default'
}

const initialState: ThemeState = {
    theme: 'light',
    background: 'default'
}

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
        },
        setBackground: (state, action) => {
            console.log('action.payload: ', action.payload);
            state.background = action.payload;
        }
    }
})

export const {toggleTheme, setBackground} = themeSlice.actions;
export const selectTheme = (state: RootState) => state.theme
export default themeSlice.reducer;