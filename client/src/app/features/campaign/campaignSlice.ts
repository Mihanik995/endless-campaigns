import {createSlice} from "@reduxjs/toolkit";
import type {RootState} from "../../store.ts";

export interface Campaigns {
    [key: string]: string | boolean | undefined

    id: string
    ownerId: string
    title: string
    description: string
    regulations: string
    dateStart: string
    dateEnd: string
    requiresRegisterApproval?: boolean
}

const initialState: Campaigns = {
    id: localStorage.getItem('ec-campaign-id') || '',
    ownerId: localStorage.getItem('ec-campaign-ownerId') || '',
    title: localStorage.getItem('ec-campaign-title') || '',
    description: localStorage.getItem('ec-campaign-description') || '',
    regulations: localStorage.getItem('ec-campaign-regulations') || '',
    dateStart: localStorage.getItem('ec-campaign-dateStart') || '',
    dateEnd: localStorage.getItem('ec-campaign-dateEnd') || '',
    requiresRegisterApproval: JSON.parse(localStorage.getItem('ec-campaign-requiresRegisterApproval') as string) || undefined,
}

export const campaignSlice = createSlice({
    name: 'campaign',
    initialState,
    reducers: {
        updateCampaign: (state, action) => {
            for (const [key, value] of Object.entries(action.payload)) {
                state[key] = value as (string | boolean)
                localStorage.setItem(`ec-campaign-${key}`, JSON.stringify(value))
            }
        },
        cleanCampaign: (state) => {
            state.id = ''
            state.ownerId = ''
            state.title = ''
            state.description = ''
            state.dateStart = ''
            state.dateEnd = ''
            state.requiresRegisterApproval = undefined

            localStorage.removeItem('ec-campaign-id')
            localStorage.removeItem('ec-campaign-ownerId')
            localStorage.removeItem('ec-campaign-title')
            localStorage.removeItem('ec-campaign-description')
            localStorage.removeItem('ec-campaign-regulations')
            localStorage.removeItem('ec-campaign-dateStart')
            localStorage.removeItem('ec-campaign-dateEnd')
            localStorage.removeItem('ec-campaign-requiresRegisterApproval')
        }
    }
})

export const {updateCampaign, cleanCampaign} = campaignSlice.actions;
export const selectCampaign = (state: RootState) => state.campaign
export default campaignSlice.reducer;