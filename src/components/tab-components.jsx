import {
  Box,
  Button,
  Field,
  Heading,
  Highlight,
  HStack,
  Input,
  Text,
  Textarea,
  VStack
} from '@chakra-ui/react'
import useFetch from '../hooks/useFetch'
import { useForm } from 'react-hook-form'
import { BASE_URL } from '../constants/app-constants'
import { useState } from 'react'
import { isEmpty } from 'lodash'
import useSWR from 'swr'

export default function PartyDetailsTab({ type, docname }) {
  const fields =
    type === 'in'
      ? ['name', 'transaction_date', 'supplier', 'billing_address_display']
      : ['name', 'posting_date', 'customer', 'address_display']
  const { fetchedData, fetchError, isLoading } = useFetch(
    type === 'in' ? `Purchase Order` : `Sales Invoice`,
    fields,
    [['name', '=', docname]]
  )
  const fetcher = (url) => fetch(url).then((res) => res.json())
  const { data, error, mutate } = useSWR(
    `${BASE_URL}/resource/Gate Pass?fields=["*"]&filters=[["linked_document", "=", "${docname}"]]&order_by=creation desc`,
    fetcher
  )

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()

  const postData = async (body) => {
    try {
      if (data?.data?.length > 0) {
        Object.entries(body).map((entry, i) => {
          if (entry[1] === data.data[0][entry[0]]) {
            delete body[entry[0]]
          }
        })
      } else {
        body = {
          ...body,
          gate_pass_type: type === 'in' ? 'Inward' : 'Outward',
          linked_to: type === 'in' ? 'Purchase Order' : 'Sales Invoice',
          linked_document: fetchedData.data[0].name || '',
          linked_document_date:
            type === 'in'
              ? fetchedData.data[0]?.transaction_date
              : fetchedData.data[0]?.posting_date
        }
      }
      const url = `${BASE_URL}/resource/Gate Pass${data?.data?.length > 0 ? `/${data?.data[0].name}` : ``}`
      if (isEmpty(body)) {
        throw 'No changes in document'
      }
      const response = await fetch(url, {
        method: data?.data?.length > 0 ? 'PUT' : 'POST',
        body: JSON.stringify(body)
      })
      const resBody = await response.json()
      mutate(resBody)
    } catch (error) {
      console.error('Failed to post data', error)
    }
  }

  if (isLoading) {
    return <div>Loading data...</div>
  }

  return (
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
            <Field.Label>{type == 'in' ? 'Supplier' : 'Customer'}</Field.Label>
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
                type == 'in' ? 'supplier_invoice_no' : 'invoice_no',
                { required: true }
              )}
              defaultValue={
                type == 'out'
                  ? fetchedData.data[0]?.name
                  : data?.data[0]?.supplier_invoice_no || ''
              }
              placeholder="Enter input here"
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>
              {type == 'in' ? 'Supplier' : ''} Invoice Date
            </Field.Label>
            <Input
              {...register(
                type == 'in' ? 'supplier_invoice_date' : 'invoice_date',
                { required: true }
              )}
              defaultValue={
                type == 'out'
                  ? fetchedData.data[0]?.posting_date
                  : data?.data[0]?.supplier_invoice_date || ''
              }
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
  )
}
