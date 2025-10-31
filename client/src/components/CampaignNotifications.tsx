import type {CustomNotification} from "../types.ts";
import {Card, Container, Flex, Heading, ScrollArea, Table} from "@radix-ui/themes";
import NewNotificationForm from "./NewNotificationForm.tsx";

interface Props {
    campaignNotifications: CustomNotification[]
    campaignId: string
    onEdit: (notifications: CustomNotification[]) => void
}

export default function ({campaignNotifications, campaignId, onEdit}: Props) {
    const notifications = campaignNotifications

    return <Container mt='3'>
        <Card size='3'>
            <Flex direction='column' gap='3' align='start'>
                <NewNotificationForm
                    campaignId={campaignId}
                    setNew={(notification) =>
                        onEdit([...notifications, notification])}
                />
                {notifications.length
                    ? <ScrollArea type='hover' scrollbars='horizontal'>
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeaderCell>
                                        Created At
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>
                                        Heading
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>
                                        Text
                                    </Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {notifications
                                    .sort((a: CustomNotification, b: CustomNotification) => {
                                        const aCreatedAt = new Date(a.createdAt)
                                        const bCreatedAt = new Date(b.createdAt)
                                        return bCreatedAt.getTime() - aCreatedAt.getTime()
                                    })
                                    .map((notification: CustomNotification) => (
                                        <Table.Row>
                                            <Table.Cell>
                                                {new Date(notification.createdAt)
                                                    .toLocaleString()}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {notification.heading}
                                            </Table.Cell>
                                            <Table.Cell maxWidth='800px' minWidth='400px'>
                                                {notification.text}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                            </Table.Body>
                        </Table.Root>
                    </ScrollArea>
                    : <Flex justify='center' align='center'>
                        <Heading wrap='balance' align='center'>
                            Here will be stored all custom notification you'll create
                            in context of the campaign.
                        </Heading>
                    </Flex>
                }
            </Flex>
        </Card>
    </Container>
}