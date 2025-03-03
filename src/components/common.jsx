import { Box, Tabs } from '@chakra-ui/react'
import React from 'react'

export default function BottomTabs({ tabs, tabStatus, activeTab, setActiveTab }) {
    return (
        <Tabs.Root
            w="100vw"
            value={activeTab}
            onValueChange={(e) => setActiveTab(e.value)}
            position="absolute"
            bottom="0"
            fitted
            defaultValue="Party Details"
            variant="enclosed"
        >
            <Tabs.List>
                {tabs?.map((tab, i) => {
                    return <Tabs.Trigger key={tab.name} value={tab.name} bgColor={tabStatus[tab.name] ? "green.400" : "yellow.300"}>
                        <Box color={tabStatus[tab.name] ? "green" : tabStatus[tabs[i - 1]?.name ? "brown" : "gray"]}>{tab.icon}</Box>
                    </Tabs.Trigger>
                })}
                {/* <Tabs.Trigger value="party_details" bgColor={tabStatus?.party_details ? "green.400" : "yellow.300"}>
                    <HiPencilAlt size={25} color={tabStatus?.party_details ? "green" : "brown"} />
                </Tabs.Trigger>
                <Tabs.Trigger value="items" bgColor={tabStatus?.items ? "green.400" : tabStatus.party_details ? "yellow.300" : "gray.300"} disabled={!tabStatus?.party_details}>
                    <HiClipboardList size={25} color={tabStatus?.items ? "green" : tabStatus.party_details ? "brown" : "gray"} />
                </Tabs.Trigger>
                <Tabs.Trigger value="images" bgColor={tabStatus?.images ? "green.400" : tabStatus.items ? "yellow.300" : "gray.300"} disabled={!tabStatus?.items}>
                    <HiCamera size={25} color={tabStatus?.images ? "green" : tabStatus.items ? "brown" : "gray"} />
                </Tabs.Trigger>
                <Tabs.Trigger value="documents" bgColor={tabStatus?.documents ? "green.400" : tabStatus.images ? "yellow.300" : "gray.300"} disabled={!tabStatus?.images}>
                    <HiFolderAdd size={25} color={tabStatus?.documents ? "green" : tabStatus.images ? "brown" : "gray"} />
                </Tabs.Trigger> */}
                <Tabs.Indicator rounded="l2" />
            </Tabs.List>
        </Tabs.Root>
    )
}
