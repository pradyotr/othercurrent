import React, { useState } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { Tabs } from '@chakra-ui/react'
import { HiPencilAlt, HiCamera, HiTruck, HiClipboardList } from 'react-icons/hi'
import PartyDetailsTab from '../components/tab-components'

export default function OrderDetails() {
  const { type } = useParams()
  const [query] = useSearchParams()
  const { isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('party_details')

  return (
    <>
      {activeTab === 'party_details' && (
        <PartyDetailsTab type={type} docname={query.get('name')} />
      )}
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
          <Tabs.Trigger value="party_details">
            <HiPencilAlt size={25} />
          </Tabs.Trigger>
          <Tabs.Trigger value="items">
            <HiClipboardList size={25} />
          </Tabs.Trigger>
          <Tabs.Trigger value="images">
            <HiCamera size={25} />
          </Tabs.Trigger>
          <Tabs.Trigger value="transporter_details">
            <HiTruck size={25} />
          </Tabs.Trigger>
          <Tabs.Indicator rounded="l2" />
        </Tabs.List>
      </Tabs.Root>
    </>
  )
}
