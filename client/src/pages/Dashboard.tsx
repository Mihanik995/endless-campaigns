import Header from "../components/Header.tsx";
import {useAppSelector} from "../app/hooks.ts";
import {selectCampaign} from "../app/features/campaign/campaignSlice.ts";
import CampaignSelector from "../components/CampaignSelector.tsx";
import CampaignProfile from "../components/CampaignProfile.tsx";

export default function () {
    const currentCampaign = useAppSelector(selectCampaign)

    return (
        <>
            <Header/>
            {currentCampaign.id
            ? <CampaignProfile/>
            : <CampaignSelector/>}
        </>
    )
}