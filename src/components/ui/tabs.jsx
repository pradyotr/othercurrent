import { Tabs } from '@chakra-ui/react'
import React from 'react'

export default function TabsComponent({ tabs }) {
    return (
        <Tabs.Root defaultValue="members" variant="plain">
            <Tabs.List bg="bg.muted" rounded="l3" p="1">
                {tabs.map((tab) => {

                    return <Tabs.Trigger key={tab} value={tab}>
                        {tab}
                    </Tabs.Trigger>
                })}
                <Tabs.Indicator rounded="l2" />
            </Tabs.List>
            {/* <Tabs.Content value="members">Manage your team members</Tabs.Content>
            <Tabs.Content value="projects">Manage your projects</Tabs.Content>
            <Tabs.Content value="tasks">
                Manage your tasks for freelancers
            </Tabs.Content> */}
        </Tabs.Root>
    )
}
