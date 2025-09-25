import {createSlice} from "@reduxjs/toolkit";
import type {RootState} from "../../store.ts";
import type {Campaign} from "../../../types.ts";

const initialState: Campaign = {
    id: localStorage.getItem('ec-campaign-id') || '',
    ownerId: localStorage.getItem('ec-campaign-ownerId') || '',
    title: localStorage.getItem('ec-campaign-title') || '',
    description: localStorage.getItem('ec-campaign-description') || '',
    regulations: localStorage.getItem('ec-campaign-regulations') || '',
    dateStart: localStorage.getItem('ec-campaign-dateStart') || '',
    dateEnd: localStorage.getItem('ec-campaign-dateEnd') || '',
    requiresRegisterApproval: JSON.parse(localStorage.getItem('ec-campaign-requiresRegisterApproval') as string) || false,
    requiresPairingResultsApproval: JSON.parse(localStorage.getItem('ec-campaign-requiresPairingResultsApproval') as string) || false,
    requiresPairingReport: JSON.parse(localStorage.getItem('ec-campaign-requiresPairingReport') as string) || false,
}

export const campaignSlice = createSlice({
    name: 'campaign',
    initialState,
    reducers: {
        updateCampaign: (state, action) => {
            for (const [key, value] of Object.entries(action.payload)) {
                state[key] = value as (string | boolean)
                [
                    'requiresRegisterApproval',
                    'requiresPairingResultsApproval',
                    'requiresPairingReport',
                ].includes(key)
                    ? localStorage.setItem(`ec-campaign-${key}`, JSON.stringify(value))
                    : localStorage.setItem(`ec-campaign-${key}`, value as string)
            }
        },
        cleanCampaign: (state) => {
            state.id = ''
            state.ownerId = ''
            state.title = ''
            state.description = ''
            state.dateStart = ''
            state.dateEnd = ''
            state.requiresRegisterApproval = false

            localStorage.removeItem('ec-campaign-id')
            localStorage.removeItem('ec-campaign-ownerId')
            localStorage.removeItem('ec-campaign-title')
            localStorage.removeItem('ec-campaign-description')
            localStorage.removeItem('ec-campaign-regulations')
            localStorage.removeItem('ec-campaign-dateStart')
            localStorage.removeItem('ec-campaign-dateEnd')
            localStorage.removeItem('ec-campaign-requiresRegisterApproval')
            localStorage.removeItem('ec-campaign-requiresPairingResultsApproval')
            localStorage.removeItem('ec-campaign-requiresPairingReport')
        }
    }
})

export const {updateCampaign, cleanCampaign} = campaignSlice.actions;
export const selectCampaign = (state: RootState) => state.campaign
export default campaignSlice.reducer;