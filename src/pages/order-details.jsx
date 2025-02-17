import React, { useState } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { Alert, CloseButton, Spinner, Tabs } from '@chakra-ui/react'
import {
  HiPencilAlt,
  HiCamera,
  HiTruck,
  HiClipboardList,
  HiCheckCircle,
  HiFolderAdd
} from 'react-icons/hi'
import PartyDetailsTab, {
  DocumentsTab,
  ImagesTab
} from '../components/tab-components'
import useSWR from 'swr'
import { BASE_URL } from '../constants/app-constants'
import useFetch from '../hooks/useFetch'
import { isEmpty } from 'lodash'
import { useForm } from 'react-hook-form'
import { getBase64 } from '../utils/utils'

export default function OrderDetails() {
  const { type } = useParams()
  const [query] = useSearchParams()
  const { isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('party_details')
  const fields =
    type === 'in'
      ? ['name', 'transaction_date', 'supplier', 'billing_address_display']
      : ['name', 'posting_date', 'customer', 'address_display']
  const { fetchedData, fetchError, isLoading } = useFetch(
    type === 'in' ? `Purchase Order` : `Sales Invoice`,
    fields,
    [['name', '=', query.get('name')]]
  )
  const fetcher = (url) => fetch(url).then((res) => res.json())
  const { data, error, mutate } = useSWR(
    `${BASE_URL}/resource/Gate Pass?fields=["*"]&filters=[["linked_document", "=", "${query.get('name')}"]]&order_by=creation desc`,
    fetcher
  )
  const [showAlert, setShowAlert] = useState()
  const [submitErrors, setSubmitErrors] = useState([])

  if (isLoading) {
    return <div>Loading data...</div>
  }
  const postData = async (body) => {
    try {
      setShowAlert(true)
      const filesToUpload = Object.entries(body).filter(
        (entry) =>
          typeof entry[1] === 'object' &&
          'length' in entry[1] &&
          entry[1].length > 0
      )

      Object.entries(body).map((entry) => {
        if (typeof entry[1] === 'object') {
          delete body[entry[0]]
        }
      })

      if (data?.data?.length > 0) {
        Object.entries(body).map((entry, i) => {
          if (entry[1] === data.data[0][entry[0]]) {
            delete body[entry[0]]
          }
        })
      } else {
        body = {
          ...body,
          gate_pass_type: type === 'in' ? 'IN' : 'OUT',
          linked_to: type === 'in' ? 'Purchase Order' : 'Sales Invoice',
          linked_document: query.get('name'),
          linked_document_date:
            type === 'in'
              ? fetchedData.data[0]?.transaction_date
              : fetchedData.data[0]?.posting_date
        }
      }
      if (isEmpty(body) && filesToUpload.length == 0) {
        throw 'No changes in document'
      }
      const url = `${BASE_URL}/resource/Gate Pass${data?.data?.length > 0 ? `/${data?.data[0].name}` : ``}`

      let docname = data.data.length ? data.data[0].name : ''
      if (!isEmpty(body)) {
        const response = await fetch(url, {
          method: data?.data?.length > 0 ? 'PUT' : 'POST',
          body: JSON.stringify(body)
        })
        const resBody = await response.json()
        if (resBody.data && resBody.data?.name) docname = resBody.data.name
        if (response.status != 200)
          setSubmitErrors([
            ...submitErrors,
            {
              type: response.status,
              message: resBody.exception || resBody._server_messages || ''
            }
          ])
        mutate(resBody)
      }

      const filesTob64 = filesToUpload.map((file) =>
        getBase64(file[1][0]).then((response) => response)
      )
      const results = await Promise.all(filesTob64)
      const allFormData = results.map((b64file, i) => {
        const form = new FormData()
        form.append('filename', filesToUpload[i][1][0]?.name)
        form.append('filedata', b64file)
        form.append('doctype', 'Gate Pass')
        form.append('docname', docname)
        if (['vehicle_image', 'material_image'].includes(filesToUpload[i][0])) {
          form.append('docfield', filesToUpload[i][0])
        }
        form.append('decode_base64', true)
        return form
      })
      const uploadFiles = allFormData.map((formdata, i) =>
        fetch(`${BASE_URL}/method/frappe.client.attach_file`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: formdata
        }).then((response) => response.json())
      )
      const fileUploadStatus = await Promise.all(uploadFiles)
      if (
        fileUploadStatus.find(
          (response) => !response.message || !response.message?.name
        )
      )
        setSubmitErrors([...submitErrors, { type: 'FileUploadError' }])
    } catch (error) {
      console.error('Failed to post data', error)
      setSubmitErrors([...submitErrors, { type: 'PostError' }])
    }
  }
  return (
    <>
      {activeTab === 'party_details' && (
        <PartyDetailsTab
          type={type}
          showAlert={showAlert}
          setShowAlert={setShowAlert}
          fetchedData={fetchedData}
          data={data}
          postData={postData}
          submitErrors={submitErrors}
        />
      )}
      {activeTab === 'images' && (
        <ImagesTab
          data={data}
          showAlert={showAlert}
          setShowAlert={setShowAlert}
          postData={postData}
          submitErrors={submitErrors}
        />
      )}
      {activeTab === 'documents' && (
        <DocumentsTab
          data={data}
          showAlert={showAlert}
          setShowAlert={setShowAlert}
          postData={postData}
          submitErrors={submitErrors}
        />
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
          <Tabs.Trigger value="documents">
            <HiFolderAdd size={25} />
          </Tabs.Trigger>
          <Tabs.Indicator rounded="l2" />
        </Tabs.List>
      </Tabs.Root>
    </>
  )
}
