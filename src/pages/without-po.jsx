import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import useGetAllDocData from "../hooks/useGetAllDocData";
import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import { isEmpty } from "lodash";
import { BASE_URL } from "../constants/app-constants";
import { getBase64 } from "../utils/utils";
import { Box, Button, Heading, VStack } from "@chakra-ui/react";
import { HiArrowLeft, HiCamera, HiFolderAdd, HiPencilAlt } from "react-icons/hi";
import BottomTabs, { ImagesForm, InputForm } from "../components/common";
import { useForm } from "react-hook-form";
import { IMAGES_FORM, INPUT_FORM } from "../constants/form-metadata";
import { DocumentsTab, FormStatusAlert } from "../components/tab-components";

export default function WithoutPO() {
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [doc, setDoc] = useState("")
    const { data, error } = useGetAllDocData(doc, true)
    const [showAlert, setShowAlert] = useState()
    const [submitErrors, setSubmitErrors] = useState([])
    const [tabStatus, setTabStatus] = useState({})
    const [activeTab, setActiveTab] = useState('party_details')
    const { mutate } = useSWRConfig()
    useEffect(() => {
        if (data && data.data.length > 0) {
            let status = { party_details: true }
            const fields = ["invoice_amount", "supplier", "supplier_invoice_no", "supplier_invoice_date"]
            fields?.map((field) => {
                if (!(field in data?.data[0]) || data.data[0][field] == "") {
                    status['party_details'] = false
                }
            })
            if (data?.data[0]?.material_image) {
                status['images'] = true
            }
            if (data?.data[0]?.attachments?.find((file) => file?.file_name?.startsWith('_D_1_'))) {
                status['documents'] = true
            }
            setTabStatus(status)
        }
    }, [data])
    if (!isAuthenticated) {
        navigate('/login')
    }
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
                    gate_pass_type: 'IN'
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
                setDoc(docname)
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
                `${BASE_URL}/resource/Gate Pass?fields=["name"]&filters=[["name", "=", "${doc}"]]&order_by=creation desc`
            )
        } catch (error) {
            console.error('Failed to post data', error)
            setSubmitErrors([...submitErrors, { type: 'PostError' }])
        }
    }
    console.log("ookok", data)
    return (
        <Box overflow="auto">
            <Button
                m="4"
                bg="gray.800"
                size="md"
                color="white"
                rounded="md"
                onClick={() => navigate('/landing/in')}
            >
                <HiArrowLeft />Back
            </Button>
            {activeTab === 'party_details' && (
                <PartyDetailsTab
                    showAlert={showAlert}
                    setShowAlert={setShowAlert}
                    data={data}
                    postData={postData}
                    status={tabStatus}
                    setStatus={setTabStatus}
                    submitErrors={submitErrors}
                    setActiveTab={setActiveTab}
                />
            )}
            {activeTab === 'images' && (
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
            {activeTab === 'documents' && (
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
            {/* {activeTab === 'items' && query.get('name') && (
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
            {activeTab === 'documents' && query.get('name') && (
                <DocumentsTab
                    data={data}
                    showAlert={showAlert}
                    setShowAlert={setShowAlert}
                    postData={postData}
                    submitErrors={submitErrors}
                    setActiveTab={setActiveTab}
                    status={tabStatus}
                />
            )} */}
            <BottomTabs
                tabs={[
                    { 'name': 'party_details', 'icon': <HiPencilAlt size={25} /> },
                    { 'name': 'images', 'icon': <HiCamera size={25} /> },
                    { 'name': 'documents', 'icon': <HiFolderAdd size={25} /> }
                ]}
                tabStatus={tabStatus}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
        </Box>
    )
}

export function PartyDetailsTab({
  data,
  postData,
  showAlert,
  setShowAlert,
  submitErrors,
  setActiveTab,
  status
}) {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    getValues,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = useForm()
  const fields = INPUT_FORM.WITHOUT_PO
  fields.map((field, i) => {
    if (data && data?.data?.length && data?.data[0][field.fieldname]) {
      field['default'] = data?.data[0][field.fieldname]
    }
  })
  return (
    <Box h="600px" overflow="auto">
      <FormStatusAlert
        isSubmitting={isSubmitting}
        isSubmitSuccessful={isSubmitSuccessful}
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        submitErrors={submitErrors}
      />
      <Box w="100vw" display="flex" alignItems="center" justifyContent="center">
        <form onSubmit={handleSubmit((data) => postData(data))}>
          <VStack gap="6" w="300px" align="center">
            <Heading size="xl">
              Supplier Details
            </Heading>
            <InputForm
              fields={INPUT_FORM.WITHOUT_PO}
              register={register}
              errors={errors}
              status={Boolean(status?.party_details)}
              setActiveTab={setActiveTab}
              nextTab="images"
            />
          </VStack>
        </form>
      </Box>
    </Box>
  )
}

export function ImagesTab({
  data,
  postData,
  showAlert,
  setShowAlert,
  submitErrors,
  setActiveTab,
  status
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = useForm()

  const files =
    data?.data[0]?.attachments?.filter((file) =>
      file.file_name.startsWith('_I_')
    ) || []
  const img_url = String(BASE_URL).slice(0, String(BASE_URL).length - 4)
  const fields = IMAGES_FORM.WITHOUT_PO
  fields.map((field, i) => {
    if (data && data.data.length && data?.data[0][field.fieldname]) {
      field['default'] = data?.data[0][field.fieldname]
    }
  })

  return (
    <Box h="600px" overflow="auto">
      <FormStatusAlert
        isSubmitting={isSubmitting}
        isSubmitSuccessful={isSubmitSuccessful}
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        submitErrors={submitErrors}
      />
      <Box w="100vw" overflow="auto" display="flex" alignItems="center" justifyContent="center">
        <form onSubmit={handleSubmit((data) => postData(data, 'I'))}>
          <VStack overflow="auto" gap="6" align="center">
            <Heading size="xl">Attach Images</Heading>
            <ImagesForm
              fields={IMAGES_FORM.WITHOUT_PO}
              register={register}
              errors={errors}
              files={files}
              status={Boolean(status?.images)}
              setActiveTab={setActiveTab}
              nextTab="documents"
            />
          </VStack>
        </form>
      </Box>
    </Box>
  )
}