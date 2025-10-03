import {Card, Dialog, Flex, Heading, IconButton, Link, Separator, Strong, Text} from "@radix-ui/themes";
import SelectInput from "./SelectInput.tsx";
import {useState} from "react";
import {ArrowUpIcon, CheckIcon, Cross2Icon, ExitIcon, PlusIcon} from "@radix-ui/react-icons";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function ({open, setOpen}: Props) {
    const [showButton, setShowButton] = useState(false);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({behavior: 'smooth'});
    };

    const handleScroll = (e) => setShowButton(e.target.scrollTop > 100)

    return <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content onScroll={handleScroll} maxHeight='90vh'>
            <Dialog.Title id='top'>
                Endless Campaigns manual
            </Dialog.Title>
            <Dialog.Description mb='5'>
                <Separator size='4'/>
            </Dialog.Description>
            <Flex direction='column' gap='5' height='100%'>
                <SelectInput
                    placeholder='Manual Navigation'
                    value={''}
                    onValueChange={scrollTo}
                    options={{
                        intro: 'Introduction',
                        nav: 'Navigation',
                        campaigns: 'Campaigns',
                        missions: 'Missions',
                        pairings: 'Pairings',
                        notifications: 'Notifications',
                    }}
                />
                <Separator size='4'/>
                <Flex direction='column' gap='4'>
                    <Card id='intro' size='2' m='2'>
                        <Flex direction='column' gap='3'>
                            <Heading>Introduction</Heading>
                            <Text>
                                This manual is supposed to provide better user experience of running our events
                                via Endless Campaigns. Here you'll find information about all the features this
                                platform grants.
                            </Text>
                        </Flex>
                    </Card>
                    <Card id='nav' size='2' m='2'>
                        <Flex direction='column' gap='3'>
                            <Heading>Navigation</Heading>
                            <Text>
                                Here's main instruments header provides:
                            </Text>
                            <Text>
                                <ul className='pl-6 list-disc'>
                                    <li className='my-1'>
                                        Logo button. Leads to Dashboard if you're logged in. Leads
                                        to the title page, if you're not.
                                    </li>
                                    <li className='my-1'>
                                        Theme button. Allows to switch theme and choose the background.
                                    </li>
                                    <li className='my-1'>
                                        Main menu. Provides paths to all general pages: Log In, Sign Up,
                                        Profile,
                                        Dashboard, this Manual etc.
                                    </li>
                                </ul>
                            </Text>
                        </Flex>
                    </Card>
                    <Card id='campaigns' size='2' m='2'>
                        <Flex direction='column' gap='3'>
                            <Heading>How to create a campaign?</Heading>
                            <Text>
                                <ul className='pl-6 list-decimal'>
                                    <li className='my-1'>
                                        Proceed tp Dashboard. Open Campaigns tab. Click either the{' '}
                                        <Strong>Create your first campaign!</Strong> button, or the{' '}
                                        <Strong>Create new campaign</Strong> button in lower left corner.
                                    </li>
                                    <li className='my-1'>
                                        Fill out the form. Hints will help to make all the setups you need.
                                    </li>
                                    <li className='my-1'>
                                        Campaign is ready! To open it, click on its card in your
                                        Dashboard. Once opened, the campaign is set up as your current one.
                                        It will always appear when you open the Campaigns dashboard section.
                                        To exit the campaign, either click the{' '}
                                        <IconButton size='1'>
                                            <ExitIcon/>
                                        </IconButton>
                                        {' '}or log out.
                                    </li>
                                    <li className='my-1'>
                                        To invite a player to it, share a campaign link from its card. A player
                                        should sign in, follow the link and open the Players tab under the
                                        campaign card. Click the <Strong>Register Form</Strong> button
                                        in the upper left corner. Once filled out the form, the player
                                        participates
                                        in the campaign (unless your approval of the register is required).
                                    </li>
                                </ul>
                            </Text>
                        </Flex>
                    </Card>
                    <Card id='missions' size='2' m='2'>
                        <Flex direction='column' gap='3'>
                            <Heading>How to create a mission?</Heading>
                            <Text>
                                <ul className='pl-6 list-decimal'>
                                    <li className='my-1'>
                                        Proceed tp Dashboard. Open Missions tab. Click either the{' '}
                                        <Strong>Create your first mission!</Strong> button, or the{' '}
                                        <Strong>Create new mission</Strong> button in lower left corner.
                                    </li>
                                    <li className='my-1'>
                                        After filling the form, you'll be redirected to the mission page.
                                        On the right (or bottom, if you're using the phone), you'll
                                        find buttons to control it. If you want to create the multistep
                                        mission, click the middle one.
                                    </li>
                                    <li className='my-1'>
                                        You're in the node editor now. The only one available to you is{' '}
                                        <Strong>ENTRYPOINT</Strong>. To trigger the node's menu,{' '}
                                        <Strong>right-click</Strong> (PCs) or <Strong>hold</Strong>{' '}
                                        (phones or tablets) it. You can also drag and drop nodes you've created,
                                        the layout will be saved for later use.
                                    </li>
                                    <li className='my-1'>
                                        <Text color='red'>
                                            <Strong>NOTICE!</Strong> All the nodes with no straight connection
                                            with <Strong>ENTRYPOINT</Strong> (backward connections doesn't
                                            count) would be lost once you'll update or leave the page! So we
                                            strongly recommend you to update the existing nodes instead of
                                            deleting
                                            them and creating the new ones, and avoid connection deletes as
                                            well.
                                        </Text>
                                    </li>
                                    <li className='my-1'>
                                        How it works for a player:
                                        <ul className='pl-6 list-disc'>
                                            <li className='my-1'>
                                                Any player starts from the <Strong>ENTRYPOINT</Strong>{' '}
                                                which represents mission card you've created at the start.
                                            </li>
                                            <li className='my-1'>
                                                Player follows th path you've created, from one node to another,
                                                via straight connections between them (backward connections
                                                still
                                                doesn't count). It looks like a buttons with options to choose
                                                (or a single button, if there's only one path).
                                            </li>
                                        </ul>
                                    </li>
                                    <li className='my-1'>
                                        Once players finish the mission (either completing mission conditions
                                        or passing the node with no proceeding), they may report you the
                                        results.
                                    </li>
                                </ul>
                            </Text>
                        </Flex>
                    </Card>
                    <Card id='pairings' size='2' m='2'>
                        <Flex direction='column' gap='3'>
                            <Heading>How to create pairings?</Heading>
                            <Text>
                                <ul className='pl-6 list-decimal'>
                                    <li className='my-1'>
                                        Open your Campaign. Below the card, open the{' '}
                                        <Strong>Periods and Pairings</Strong> tab. To create the pairing,
                                        you have to add a campaign period it will be assigned to. Use{' '}
                                        <Strong>Add Period</Strong> button.
                                    </li>
                                    <li className='my-1'>
                                        Once the period is created, you can assign a pairing to it. To do so,
                                        you need at least one mission and one approved campaign registration.
                                        <ul className='pl-6 list-disc'>
                                            <li className='my-1'>
                                                To select a mission, just use the according selector.
                                            </li>
                                            <li className='my-1'>
                                                To add a player, click the{' '}
                                                <IconButton size='1'>
                                                    <PlusIcon/>
                                                </IconButton>
                                                {' '}. Select a player. Now click the{' '}
                                                <IconButton size='1' color='grass'>
                                                    <CheckIcon/>
                                                </IconButton>
                                                {' '}to submit the selection. To delete the player selected
                                                previously, click the{' '}
                                                <IconButton size='1' color='red' radius='full'>
                                                    <Cross2Icon/>
                                                </IconButton>
                                                {' '}.
                                            </li>
                                        </ul>
                                    </li>
                                    <li className='my-1'>
                                        Once the pairing is created, it will be available for all the players
                                        assigned to it in their Dashboard, in <Strong>Pairings</Strong> tab.
                                        To play it, a player should click the <Strong>Play the mission</Strong>
                                        {' '}button. Once a player sends you the result the pairing will count
                                        as played for all of its participants (unless your campaign requires
                                        pairing results verification).
                                        <ul className='pl-6 list-disc'>
                                            <li>
                                                In such case, you'll have an option to reject pairing results
                                                and note the reason. Once pairing results are rejected, players
                                                will need to rereport you about the pairing is played, with
                                                according result changes.
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </Text>
                        </Flex>
                    </Card>
                    <Card id='notifications' size='2' m='2'>
                        <Flex direction='column' gap='3'>
                            <Heading>Notifications</Heading>
                            <Text>
                                <ul className='pl-6 list-decimal'>
                                    <li className='my-1'>
                                        There are 2 Endless Campaigns may notify you about any events:
                                        <ul className='pl-6 list-disc'>
                                            <li className='my-1'>
                                                E-mail letters
                                            </li>
                                            <li className='my-1'>
                                                Telegram messages
                                            </li>
                                        </ul>
                                        To use the latter, you have to provide the chat ID to the system.
                                        To get the chat ID, follow{' '}
                                        <Link href='https://t.me/endless_campaigns_bot' target='_blank'>
                                            the link
                                        </Link>, start the conversation and select <Strong>
                                        Register
                                    </Strong>. The bot will provide you the chat ID.
                                    </li>
                                    <li className='my-1'>
                                        The bot notifies you about following events:
                                        <ul className='pl-6 list-disc'>
                                            <li className='my-1'>
                                                New player registered to your campaign.
                                            </li>
                                            <li>
                                                You was asked a new question about one of your
                                                missions.
                                            </li>
                                            <li className='my-1'>
                                                New pairing was assigned to you.
                                            </li>
                                            <li className='my-1'>
                                                Some of your campaign's pairings was just finished
                                                and reported.
                                            </li>
                                            <li className='my-1'>
                                                One of your pairings' results was rejected.
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </Text>
                        </Flex>
                    </Card>
                </Flex>
            </Flex>
            {showButton && (
                <Flex justify='end'>
                    <IconButton
                        size='4'
                        radius='full'
                        color='grass'
                        style={{
                            position: 'fixed',
                            bottom: '55px',
                            // right: '1rem',
                        }}
                        onClick={() => scrollTo('top')}
                    >
                        <ArrowUpIcon/>
                    </IconButton>
                </Flex>
            )}
        </Dialog.Content>
    </Dialog.Root>
}