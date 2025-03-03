import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { Alert, Box, Button, CloseButton, Spinner, Tabs, VStack } from '@chakra-ui/react'
import {
  HiPencilAlt,
  HiCamera,
  HiTruck,
  HiClipboardList,
  HiCheckCircle,
  HiFolderAdd,
  HiArrowLeft
} from 'react-icons/hi'
import PartyDetailsTab, {
  DocumentsTab,
  ImagesTab,
  ItemsTab
} from '../components/tab-components'
import useSWR, { useSWRConfig } from 'swr'
import { BASE_URL } from '../constants/app-constants'
import useFetch from '../hooks/useFetch'
import { isEmpty } from 'lodash'
import { useForm } from 'react-hook-form'
import { getBase64 } from '../utils/utils'
import useGetAllDocData from '../hooks/useGetAllDocData'
import useFetchWithChildren from '../hooks/useFetchWithChildren'
import BottomTabs from '../components/common'

export default function OrderDetails() {
  const { type } = useParams()
  const [query] = useSearchParams()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { mutate } = useSWRConfig()
  const [activeTab, setActiveTab] = useState('party_details')
  const fields =
    type === 'in'
      ? ['name', 'transaction_date', 'supplier', 'billing_address_display']
      : ['name', 'posting_date', 'customer', 'address_display']
  const { fetchedData, fetchError, isLoading } = useFetchWithChildren(
    type === 'in' ? `Purchase Order` : `Sales Invoice`,
    query.get('name')
  )
  const fetcher = (url) => fetch(url).then((res) => res.json())
  const { data, error } = useGetAllDocData(query.get('name'))
  const [showAlert, setShowAlert] = useState()
  const [submitErrors, setSubmitErrors] = useState([])
  const [tabStatus, setTabStatus] = useState({})
  useEffect(() => {
    if (data && data.data.length > 0) {
      let status = {party_details: true, items: true}
      const fields = ["supplier","supplier_invoice_no","supplier_invoice_date"]
      fields?.map((field) => {
        if (!(field in data?.data[0]) || data.data[0][field] == "") {
          status['party_details'] = false
        } 
      })
      if(data?.data[0]?.gate_pass_items.length == 0) {
        status['items'] = false
      } else {
        fetchedData?.data?.items?.map((row, i) => {
          if( !(data?.data[0]?.gate_pass_items.length > i && data?.data[0]?.gate_pass_items[i]?.total_qty !=0 && data?.data[0]?.gate_pass_items[i]?.qty_no !=0)) {
            status['items'] = false
          } else {
            status['items'] = true
          }
        })
      }
      if (data?.data[0]?.vehicle_image && data?.data[0]?.material_image)  {
        status['images'] = true
      }
      if(data?.data[0]?.attachments?.find((file) => file?.file_name?.startsWith('_D_1_')))  {
        status['documents'] = true
      }
      setTabStatus(status)
    }
  }, [data])
  if (!isAuthenticated) {
    navigate('/login')
  }
  if (isLoading) {
    return <div>Loading data...</div>
  }
  // if (data?.data[0]?.docstatus === 1) {
  //   navigate(`/submit?docname=${data?.data[0]?.name}`)
  // }
  const postData = async (body, fileName = '') => {
    try {
      setShowAlert(true)
      const filesToUpload = Object.entries(body).filter(
        (entry) =>
          typeof entry[1] === 'object' &&
          entry[0] !== 'gate_pass_items' &&
          'length' in entry[1] &&
          entry[1].length > 0
      )
      Object.entries(body).map((entry) => {
        if (typeof entry[1] === 'object' && entry[0] !== 'gate_pass_items') {
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
              ? fetchedData.data?.transaction_date
              : fetchedData.data?.posting_date
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
      }

      const filesTob64 = filesToUpload.map((file) =>
        getBase64(file[1][0]).then((response) => response)
      )
      const results = await Promise.all(filesTob64)
      const allFormData = results.map((b64file, i) => {
        const form = new FormData()
        form.append(
          'filename',
          `${filesToUpload[i][0]}${filesToUpload[i][1][0]?.name}`
        )
        form.append('filedata', b64file)
        form.append('doctype', 'Gate Pass')
        form.append('docname', docname)
        if (['vehicle_image', 'material_image'].includes(filesToUpload[i][0])) {
          form.append('docfield', filesToUpload[i][0])
        }
        form.append('decode_base64', true)
        return form
      })

      const filesToRemove = []
      if (data.data[0]?.attachments?.length) {
        filesToUpload.map((file, i) => {
          const fileIndex = file[0].slice(0, 5).split('_')
          const fileDoc = data.data[0]?.attachments?.find((f) =>
            f.file_name.startsWith(`_${fileIndex[1]}_${fileIndex[2]}_`)
          )
          filesToRemove.push(fileDoc?.name)
        })
      }

      const runRemoveFiles = filesToRemove.map((file, i) => {
        fetch(`${BASE_URL}/resource/File/${file}`, { method: 'DELETE' }).then(
          (r) => r.json()
        )
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
      mutate(
        `${BASE_URL}/resource/Gate Pass?fields=["name"]&filters=[["linked_document", "=", "${query.get('name')}"]]&order_by=creation desc`
      )
    } catch (error) {
      console.error('Failed to post data', error)
      setSubmitErrors([...submitErrors, { type: 'PostError' }])
    }
  }
  return (
    <Box overflow="auto">
      <Button
        m="4"
        bg="gray.800"
        size="md"
        color="white"
        rounded="md"
        onClick={() => navigate(-1)}
      >
        <HiArrowLeft />Back
      </Button>
      {activeTab === 'party_details' && query.get('name') && (
        <PartyDetailsTab
          type={type}
          showAlert={showAlert}
          setShowAlert={setShowAlert}
          fetchedData={fetchedData}
          data={data}
          postData={postData}
          status={tabStatus}
          setStatus={setTabStatus}
          submitErrors={submitErrors}
          setActiveTab={setActiveTab}
        />
      )}
      {activeTab === 'items' && query.get('name') && (
        <ItemsTab
          type={type}
          showAlert={showAlert}
          setShowAlert={setShowAlert}
          fetchedData={fetchedData}
          data={data}
          status={tabStatus}
          setStatus={setTabStatus}
          postData={postData}
          submitErrors={submitErrors}
          setActiveTab={setActiveTab}
        />
      )}
      {activeTab === 'images' && query.get('name') && (
        <ImagesTab
          data={data}
          showAlert={showAlert}
          setShowAlert={setShowAlert}
          postData={postData}
          submitErrors={submitErrors}
          setActiveTab={setActiveTab}
          setStatus={setTabStatus}
          status={tabStatus}
        />
      )}
      {activeTab === 'documents' && query.get('name') &&  (
        <DocumentsTab
          data={data}
          showAlert={showAlert}
          setShowAlert={setShowAlert}
          postData={postData}
          submitErrors={submitErrors}
          setActiveTab={setActiveTab}
          status={tabStatus}
        />
      )}
      <BottomTabs
        tabs={[
          {'name': 'party_details', 'icon': <HiPencilAlt size={25} />},
          {'name': 'items', 'icon': <HiClipboardList size={25} />},
          {'name': 'images', 'icon': <HiCamera size={25} />},
          {'name': 'documents', 'icon': <HiFolderAdd size={25} />}
        ]}
        tabStatus={tabStatus}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {/* <Tabs.Root
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
          <Tabs.Trigger value="party_details" bgColor={tabStatus?.party_details ?"green.400": "yellow.300"}>
            <HiPencilAlt size={25} color={tabStatus?.party_details ?"green":"brown"} />
          </Tabs.Trigger>
          <Tabs.Trigger value="items" bgColor={tabStatus?.items ?"green.400": tabStatus.party_details? "yellow.300": "gray.300"} disabled={!tabStatus?.party_details}>
            <HiClipboardList size={25} color={tabStatus?.items ?"green":tabStatus.party_details? "brown": "gray"} />
          </Tabs.Trigger>
          <Tabs.Trigger value="images" bgColor={tabStatus?.images ?"green.400": tabStatus.items? "yellow.300": "gray.300"} disabled={!tabStatus?.items}>
            <HiCamera size={25} color={tabStatus?.images ?"green":tabStatus.items? "brown": "gray"} />
          </Tabs.Trigger>
          <Tabs.Trigger value="documents" bgColor={tabStatus?.documents ?"green.400": tabStatus.images? "yellow.300": "gray.300"} disabled={!tabStatus?.images}>
            <HiFolderAdd size={25} color={tabStatus?.documents ?"green":tabStatus.images? "brown": "gray"} />
          </Tabs.Trigger>
          <Tabs.Indicator rounded="l2" />
        </Tabs.List>
      </Tabs.Root> */}
    </Box>
  )
}
