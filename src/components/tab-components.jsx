import {
  Alert,
  Box,
  Button,
  CloseButton,
  Field,
  Heading,
  Highlight,
  HStack,
  Image,
  Input,
  Spinner,
  Text,
  Textarea,
  VStack
} from '@chakra-ui/react'
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger
} from '../components/ui/file-upload'
import useFetch from '../hooks/useFetch'
import { useForm } from 'react-hook-form'
import { BASE_URL } from '../constants/app-constants'
import { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import useSWR from 'swr'
import { HiCamera, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi'
import { NavLink } from 'react-router'

export default function PartyDetailsTab({
  type,
  fetchedData,
  data,
  postData,
  showAlert,
  setShowAlert,
  submitErrors
}) {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = useForm()

  return (
    <>
      <FormStatusAlert
        isSubmitting={isSubmitting}
        isSubmitSuccessful={isSubmitSuccessful}
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        submitErrors={submitErrors}
      />
      <Box w="100vw" display="flex" alignItems="center" justifyContent="center">
        <form onSubmit={handleSubmit((data) => postData(data))}>
          <VStack gap="6" align="center">
            <Heading size="xl">
              {type == 'in' ? 'Supplier' : 'Customer'} Details
            </Heading>
            <HStack gap="4">
              <Text>
                <Highlight query="PO No:" styles={{ fontWeight: 'bold' }}>
                  PO No:
                </Highlight>
                {fetchedData.data[0]?.name}
              </Text>
              <Text>
                <Highlight query="Dated:" styles={{ fontWeight: 'bold' }}>
                  Dated:
                </Highlight>
                {type == 'in'
                  ? fetchedData.data[0]?.transaction_date
                  : fetchedData.data[0]?.posting_date}
              </Text>
            </HStack>
            <Field.Root>
              <Field.Label>
                {type == 'in' ? 'Supplier' : 'Customer'}
              </Field.Label>
              <Input
                {...register(type == 'in' ? 'supplier' : 'customer')}
                disabled
                defaultValue={
                  type == 'in'
                    ? fetchedData.data[0]?.supplier
                    : fetchedData.data[0]?.customer
                }
              />
            </Field.Root>
            <Field.Root>
              <Field.Label>
                {type == 'in' ? 'Supplier' : 'Customer'} Address
              </Field.Label>
              <Textarea
                {...register(
                  type == 'in' ? 'supplier_address' : 'customer_address'
                )}
                disabled
                autoresize
                maxH="10lh"
                defaultValue={
                  type == 'in'
                    ? String(
                        fetchedData.data[0]?.billing_address_display
                      ).replaceAll('<br>', '\n')
                    : String(fetchedData.data[0]?.address_display).replaceAll(
                        '<br>',
                        '\n'
                      )
                }
              />
            </Field.Root>
            <Field.Root>
              <Field.Label>
                {type == 'in' ? 'Supplier' : ''} Invoice No.
              </Field.Label>
              <Input
                {...register(
                  type == 'in' ? 'supplier_invoice_no' : 'invoice_no'
                )}
                defaultValue={
                  type == 'out'
                    ? fetchedData.data[0]?.name
                    : data?.data[0]?.supplier_invoice_no || ''
                }
                required={type == 'in' ? true : false}
                placeholder="Enter input here"
              />
            </Field.Root>
            <Field.Root>
              <Field.Label>
                {type == 'in' ? 'Supplier' : ''} Invoice Date
              </Field.Label>
              <Input
                {...register(
                  type == 'in' ? 'supplier_invoice_date' : 'invoice_date'
                )}
                defaultValue={
                  type == 'out'
                    ? fetchedData.data[0]?.posting_date
                    : data?.data[0]?.supplier_invoice_date || ''
                }
                required={type == 'in' ? true : false}
                type="date"
              />
            </Field.Root>
            <Box display="flex" justifyContent="center">
              <Button type="submit" color="white" bg="black">
                Confirm
              </Button>
            </Box>
          </VStack>
        </form>
      </Box>
    </>
  )
}

export function ImagesTab({
  data,
  postData,
  showAlert,
  setShowAlert,
  submitErrors
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = useForm()

  const [addlImages, setAddlImages] = useState([])
  const files =
    data?.data[0]?.attachments?.filter((file) =>
      file.file_name.startsWith('I__')
    ) || []
  const img_url = String(BASE_URL).slice(0, String(BASE_URL).length - 4)

  return (
    <>
      <FormStatusAlert
        isSubmitting={isSubmitting}
        isSubmitSuccessful={isSubmitSuccessful}
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        submitErrors={submitErrors}
      />
      <Box w="100vw" display="flex" alignItems="center" justifyContent="center">
        <form onSubmit={handleSubmit((data) => postData(data, 'I__'))}>
          <VStack gap="6" align="center">
            <Heading size="xl">Capture Image</Heading>
            <Field.Root orientation="horizontal">
              <Field.Label>Image of Vehicle</Field.Label>
              {data && data.data.length && data.data[0].vehicle_image ? (
                <NavLink
                  to={`${BASE_URL.slice(0, BASE_URL.length - 3)}${data.data[0].vehicle_image}`}
                >
                  <Image
                    h="100px"
                    w="100px"
                    src={`${img_url}${data.data[0].vehicle_image}`}
                  />
                </NavLink>
              ) : (
                <></>
              )}
              <FileUploadRoot
                {...register('vehicle_image')}
                capture="environment"
              >
                <FileUploadTrigger asChild>
                  <Button variant="outline" size="sm">
                    <HiCamera /> Capture
                  </Button>
                </FileUploadTrigger>
                <FileUploadList />
              </FileUploadRoot>
            </Field.Root>
            <Field.Root orientation="horizontal">
              <Field.Label>Image of Material</Field.Label>
              {data && data.data.length && data.data[0].material_image ? (
                <NavLink
                  to={`${BASE_URL.slice(0, BASE_URL.length - 3)}${data.data[0].material_image}`}
                >
                  <Image
                    h="100px"
                    w="100px"
                    src={`${img_url}${data.data[0].material_image}`}
                  />
                </NavLink>
              ) : (
                <></>
              )}
              <FileUploadRoot
                {...register('material_image')}
                capture="environment"
              >
                <FileUploadTrigger asChild>
                  <Button variant="outline" size="sm">
                    <HiCamera /> Capture
                  </Button>
                </FileUploadTrigger>
                <FileUploadList />
              </FileUploadRoot>
            </Field.Root>
            {files?.map((file, i) => {
              return (
                <Box key={`${i}${file}`} justifyItems="center">
                  <Text>{file.file_name}</Text>
                  <NavLink
                    key={`${i}${file.file_url}`}
                    to={`${BASE_URL.slice(0, BASE_URL.length - 3)}${file.file_url}`}
                  >
                    {file.file_type === 'PDF' ? (
                      <Text>{file.file_url}</Text>
                    ) : (
                      <Image
                        h="100px"
                        w="100px"
                        src={`${BASE_URL.slice(0, BASE_URL.length - 3)}${file.file_url}`}
                      />
                    )}
                  </NavLink>
                </Box>
              )
            })}
            {addlImages.map((index) => {
              return (
                <Field.Root key={index} orientation="horizontal">
                  <Field.Label>Add Image</Field.Label>
                  <FileUploadRoot
                    {...register(`image-${index}`)}
                    capture="environment"
                  >
                    <FileUploadTrigger asChild>
                      <Button variant="outline" size="sm">
                        <HiCamera /> Capture
                      </Button>
                    </FileUploadTrigger>
                    <FileUploadList />
                  </FileUploadRoot>
                </Field.Root>
              )
            })}
            <Box display="flex" justifyContent="center">
              <Button
                onClick={() =>
                  setAddlImages([...addlImages, addlImages.length + 1])
                }
                color="black/80"
                rounded="md"
                borderColor="black/30"
              >
                + Attach more images
              </Button>
            </Box>
            <Box display="flex" justifyContent="center">
              <Button type="submit" color="white" bg="black">
                Confirm
              </Button>
            </Box>
          </VStack>
        </form>
      </Box>
    </>
  )
}

export function DocumentsTab({
  data,
  postData,
  showAlert,
  setShowAlert,
  submitErrors
}) {
  const [documents, setDocuments] = useState([])
  const files =
    data?.data[0]?.attachments?.filter((file) =>
      file.file_name.startsWith('D__')
    ) || []
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = useForm()

  return (
    <>
      <FormStatusAlert
        isSubmitting={isSubmitting}
        isSubmitSuccessful={isSubmitSuccessful}
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        submitErrors={submitErrors}
      />
      <Box w="100vw" display="flex" alignItems="center" justifyContent="center">
        <form onSubmit={handleSubmit((data) => postData(data, 'D__'))}>
          <VStack gap="6" align="center">
            <Heading size="xl">Attach Documents</Heading>
            <Text>You can attach as many documents as needed</Text>
            {files?.map((file, i) => {
              return (
                <Box key={`${i}${file}`} justifyItems="center">
                  <Text>{file.file_name}</Text>
                  <NavLink
                    key={`${i}${file.file_url}`}
                    to={`${BASE_URL.slice(0, BASE_URL.length - 3)}${file.file_url}`}
                  >
                    {file.file_type === 'PDF' ? (
                      <Text>{file.file_url}</Text>
                    ) : (
                      <Image
                        h="100px"
                        w="100px"
                        src={`${BASE_URL.slice(0, BASE_URL.length - 3)}${file.file_url}`}
                      />
                    )}
                  </NavLink>
                </Box>
              )
            })}
            {documents.map((index) => {
              return (
                <Field.Root
                  unstyled="true"
                  key={index}
                  display="flex"
                  justifyItems="center"
                >
                  <Field.Label>Add Image</Field.Label>
                  <FileUploadRoot
                    {...register(`image-${index}`)}
                    capture="environment"
                  >
                    <FileUploadTrigger asChild>
                      <Button variant="outline" size="sm">
                        <HiCamera /> Capture
                      </Button>
                    </FileUploadTrigger>
                    <FileUploadList />
                  </FileUploadRoot>
                </Field.Root>
              )
            })}
            <Box display="flex" justifyContent="center">
              <Button
                onClick={() =>
                  setDocuments([...documents, documents.length + 1])
                }
                color="black/80"
                rounded="md"
                borderColor="black/30"
              >
                + Attach images
              </Button>
            </Box>
            <Box display="flex" justifyContent="center">
              <Button type="submit" color="white" bg="black">
                Confirm
              </Button>
            </Box>
          </VStack>
        </form>
      </Box>
    </>
  )
}

function FormStatusAlert({
  isSubmitting,
  isSubmitSuccessful,
  showAlert,
  setShowAlert,
  submitErrors
}) {
  const alertObject = RenderAlert(
    isSubmitting,
    isSubmitSuccessful,
    submitErrors,
    showAlert
  )
  return (
    <>
      {alertObject?.showCondition ? (
        <Alert.Root
          borderStartWidth="3px"
          w="100vw"
          display="flex"
          alignItems="center"
          status={alertObject?.status}
          borderStartColor="colorPalette.600"
          title={alertObject?.message}
        >
          <Alert.Indicator>{alertObject?.icon}</Alert.Indicator>
          <Alert.Title>{alertObject?.message}</Alert.Title>
          <CloseButton onClick={() => setShowAlert(false)} />
        </Alert.Root>
      ) : (
        <></>
      )}
    </>
  )
}

function RenderAlert(
  isSubmitting,
  isSubmitSuccessful,
  submitErrors,
  showAlert
) {
  if (isSubmitting) {
    return {
      showCondition: true,
      status: 'info',
      message: 'Submitting data, please wait...',
      icon: <Spinner size="sm" />
    }
  }
  if (submitErrors && submitErrors.length && showAlert) {
    return {
      showCondition: true,
      status: 'error',
      message: 'Error occured while submitting, please retry.',
      icon: <HiExclamationCircle />
    }
  }
  if (isSubmitSuccessful && showAlert) {
    return {
      showCondition: true,
      status: 'success',
      message: 'Successfully submitted',
      icon: <HiCheckCircle />
    }
  }
  return null
}
