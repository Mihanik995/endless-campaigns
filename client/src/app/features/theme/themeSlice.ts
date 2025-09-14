import {createSlice} from "@reduxjs/toolkit";
import type {RootState} from "../../store.ts";

export interface ThemeState {
    theme: 'dark' | 'light';
}

const initialState: ThemeState = {
    theme: 'light',
}

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
        }
    }
})

export const {toggleTheme} = themeSlice.actions;
export const selectTheme = (state: RootState) => state.theme
export default themeSlice.reducer;