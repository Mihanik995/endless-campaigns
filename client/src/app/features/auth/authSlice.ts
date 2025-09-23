import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios, {type AxiosResponse} from "axios";
import type {RootState} from "../../store.ts";

export const login = createAsyncThunk(
    'auth/login',
    async (data: { username: string, password: string }, {rejectWithValue}) => {
        try {
            const res: AxiosResponse = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
                data,
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
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
    id?: string;
    username?: string;
    token?: string,
    loading: boolean,
    error?: any,
    success: boolean,
}

const initialState: AuthState = {
    id: localStorage.getItem('ec-id') || undefined,
    username: localStorage.getItem('ec-username') || undefined,
    token: localStorage.getItem('ec-access') || undefined,
    loading: false,
    success: false,
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.token = undefined
            state.id = undefined
            state.username = undefined
            state.success = false
            localStorage.removeItem('ec-access')
            localStorage.removeItem('ec-id')
            localStorage.removeItem('ec-username')
        },
        refresh: (state, action) => {
            state.token = action.payload.accessToken
            state.id = action.payload.userId
            state.username = action.payload.username
            localStorage.setItem('ec-access', action.payload.accessToken)
            localStorage.setItem('ec-id', action.payload.userId)
            localStorage.setItem('ec-username', action.payload.username)
            state.success = true
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
            state.token = action.payload.accessToken
            state.id = action.payload.userId
            state.username = action.payload.username
            localStorage.setItem('ec-access', action.payload.accessToken)
            localStorage.setItem('ec-id', action.payload.userId)
            localStorage.setItem('ec-username', action.payload.username)
        })
    }
})

export const {logout, refresh} = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth

export default authSlice.reducer;