import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios, {type AxiosResponse} from "axios";
import type {RootState} from "../../store.ts";

export const login = createAsyncThunk(
    'auth/login',
    async (data: {username: string, password: string}, {rejectWithValue}) => {
        try {
            const res: AxiosResponse = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
                data,
                {headers: {'Content-Type': 'application/json'}}
            )
            return res.data
        } catch (error: any) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)

export interface AuthState {
    token: string,
    loading: boolean,
    error: any,
    success: boolean,
}

const initialState: AuthState = {
    token: '',
    loading: false,
    error: null as any,
    success: false,
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.token = ''
        }
    },
    extraReducers: (builder) => {
        builder.addCase((login.pending), (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase((login.rejected), (state, action) => {
            state.loading = false
            state.error = action.payload
        })
        builder.addCase((login.fulfilled), (state, action) => {
            state.loading = false
            state.success = true
            state.token = action.payload.token
        })
    }
})

export const {logout} = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth

export default authSlice.reducer;