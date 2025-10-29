import {createSlice} from "@reduxjs/toolkit";
import type {RootState} from "../../store.ts";

const initialState = {
    id: localStorage.getItem('ec-campaign-id') || '',
}

export const campaignSlice = createSlice({
    name: 'campaign',
    initialState,
    reducers: {
        updateCampaign: (state, action) => {
            state.id = action.payload
            localStorage.setItem(`ec-campaign-id`, action.payload as string)
        },
        cleanCampaign: (state) => {
            state.id = ''
            localStorage.removeItem('ec-campaign-id')
        }
    }
})

export const {updateCampaign, cleanCampaign} = campaignSlice.actions;
export const selectCampaign = (state: RootState) => state.campaign
export default campaignSlice.reducer;