import Header from "../components/Header.tsx";
import {useAppSelector} from "../app/hooks.ts";
import {selectAuth} from "../app/features/auth/authSlice.ts";
import {Navigate, useNavigate} from "react-router";
import {Card, Container, Flex, Grid, Heading, Inset, Link, Separator, Text} from "@radix-ui/themes";
import {
    DoubleArrowUpIcon,
    EnvelopeClosedIcon,
    GearIcon,
    ReaderIcon,
    RocketIcon,
    Share1Icon
} from "@radix-ui/react-icons";

export default function CreateCampaignForm() {
    const auth = useAppSelector(selectAuth)
    const navigate = useNavigate();

    return auth.token
        ? <Navigate to={'/dashboard'} replace/>
        : <>
            <Header/>
            <Container width='100vw' maxWidth='1000px' className='pb-5 pt-23'>
                <Card size='3'>
                    <Flex direction='column' gap='5' align='center'>
                        <Card>
                            <Flex gap='5' direction={{
                                initial: 'column',
                                sm: 'row'
                            }}>
                                <Inset clip='padding-box'>
                                    <img
                                        src='/home-logo.png'
                                        alt='logo'
                                        style={{width: '600px',}}
                                    />
                                </Inset>
                                <Flex
                                    p='4' direction='column' gap='5'
                                    maxWidth={{initial: 'auto', sm: '50vw'}} justify='center'
                                >
                                    <Heading size={{initial: '6', md: '8'}}>
                                        What is Endless Campaigns?
                                    </Heading>
                                    <Text size={{initial: '3', md: '4'}}>
                                        Endless Campaigns is a service for creating and running campaigns
                                        in game systems such as Necromunda, Mordheim, Frostgrave, etc.
                                    </Text>
                                    <Text size='4'>
                                        It is supposed to help campaign masters to create and maintain campaigns,
                                        describe and clarify mission rules, form pairings and track players progress.
                                    </Text>
                                </Flex>
                            </Flex>
                        </Card>
                        <Heading size={{initial: '6', md: '8'}}>
                            What Endless Campaigns provide?
                        </Heading>
                        <Grid columns={{initial: '1', xs: '2', sm: '3'}} gap='5' width='auto'>
                            <Card size='3'>
                                <Flex direction='column' gap='2'>
                                    <Text weight='bold'>
                                        <Flex gap='2' align='center' justify='center'>
                                            <RocketIcon/>
                                            Campaign Management
                                        </Flex>
                                    </Text>
                                    <Text>
                                        Create and maintain a campaign of any scale and depth
                                        with ease of feed scrolling.
                                    </Text>
                                </Flex>
                            </Card>
                            <Card size='3'>
                                <Flex direction='column' gap='2'>
                                    <Text weight='bold'>
                                        <Flex gap='2' align='center' justify='center'>
                                            <Share1Icon/>
                                            Advanced Missions
                                        </Flex>
                                    </Text>
                                    <Text>
                                        Add multi-step missions hiding conditions till the moment
                                        or running in several different paths.
                                    </Text>
                                </Flex>
                            </Card>
                            <Card size='3'>
                                <Flex direction='column' gap='2'>
                                    <Text weight='bold'>
                                        <Flex gap='2' align='center' justify='center'>
                                            <EnvelopeClosedIcon/>
                                            Notifications
                                        </Flex>
                                    </Text>
                                    <Text>
                                        New question? Pairing assigned? Game report sent?
                                        You will be notified the way you choose.
                                    </Text>
                                </Flex>
                            </Card>
                            <Card size='3'>
                                <Flex direction='column' gap='2'>
                                    <Text weight='bold'>
                                        <Flex gap='2' align='center' justify='center'>
                                            <GearIcon/>
                                            System Independence
                                        </Flex>
                                    </Text>
                                    <Text>
                                        You're not restricted with systems noted above.
                                        Endless Campaign is fit for any wargame you want.
                                    </Text>
                                </Flex>
                            </Card>
                            <Card size='3'>
                                <Flex direction='column' gap='2'>
                                    <Text weight='bold'>
                                        <Flex gap='2' align='center' justify='center'>
                                            <ReaderIcon/>
                                            Complete Guide
                                        </Flex>
                                    </Text>
                                    <Text>
                                        Got yourself lost in the interface?
                                        This guide will help you deal with any issues.
                                    </Text>
                                </Flex>
                            </Card>
                            <Card size='3'>
                                <Flex direction='column' gap='2'>
                                    <Text weight='bold'>
                                        <Flex gap='2' align='center' justify='center'>
                                            <DoubleArrowUpIcon/>
                                            Fast-Growing
                                        </Flex>
                                    </Text>
                                    <Text>
                                        New features every month. Use them all or choose
                                        exactly what you need.
                                    </Text>
                                </Flex>
                            </Card>
                        </Grid>
                        <Flex gap='3' justify='center' direction={{
                            initial: 'column',
                            xs: 'row'
                        }}>
                            <Flex width={{
                                xs: '40vw'
                            }} direction='column' gap='1' align='end'>
                                <Text size={{initial: '3', md: '4'}} align='right' weight='bold'>
                                    Ready to get started?
                                </Text>
                                <Text size={{initial: '3', md: '4'}} align='right'>
                                    <Link weight='bold' href='' onClick={() => navigate('/auth/signup')}>
                                        Sign up now
                                    </Link>
                                    {' '}and run your first campaign with new tools!
                                </Text>
                            </Flex>
                            <Separator orientation={{
                                initial: 'horizontal',
                                xs: 'vertical'
                            }} size={{
                                initial: '4',
                                xs: '3'
                            }}/>
                            <Flex width={{
                                xs: '40vw'
                            }} direction='column' gap='1'>
                                <Text size={{initial: '3', md: '4'}} weight='bold'>
                                    Already have an account?{' '}
                                </Text>
                                <Text size={{initial: '3', md: '4'}}>
                                    What are you waiting for then?{' '}
                                    <Link weight='bold' href='' onClick={() => navigate('/auth/login')}>
                                        Sign in!
                                    </Link>
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </Card>
            </Container>
        </>
}
