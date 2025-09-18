import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import themeReducer from './features/theme/themeSlice'
import campaignReducer from './features/campaign/campaignSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
        campaign: campaignReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store