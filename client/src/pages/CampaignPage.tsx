import Header from "../components/Header.tsx";
import {Card, Container} from "@radix-ui/themes";
import CampaignProfile from "../components/CampaignProfile.tsx";
import {useParams} from "react-router";

export default function () {
    const id = useParams().id as string;

    return (
        <>
            <Header/>
            <Container className='pb-5 pt-23'>
                <Card size='1'>
                    <CampaignProfile id={id}/>
                </Card>
            </Container>
        </>
    )
}