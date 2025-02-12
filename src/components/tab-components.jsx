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

export default function PartyDetailsTab({ type, docname }) {
  const fields =
    type === 'in'
      ? ['name', 'transaction_date', 'supplier', 'billing_address_display']
      : ['name', 'posting_date', 'customer', 'address_display']
  const { data, error, isLoading } = useFetch(
    type === 'in' ? `Purchase Order` : `Sales Invoice`,
    fields,
    [['name', '=', docname]]
  )
  const [response, setResponse] = useState({})

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const postData = async (body) => {
    try {
      body = {
        ...body,
        gate_pass_type: type === 'in' ? 'Inward' : 'Outward',
        linked_to: type === 'in' ? 'Purchase Order' : 'Sales Invoice',
        linked_document: data?.data[0].name || '',
        linked_document_date:
          type === 'in'
            ? data?.data[0]?.transaction_date
            : data?.data[0]?.posting_date
      }
      const response = await fetch(`${BASE_URL}/resource/Gate Pass`, {
        method: 'POST',
        body: JSON.stringify(body)
      })
      const resBody = await response.json()
      setResponse(resBody)
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
              {data?.data[0]?.name}
            </Text>
            <Text>
              <Highlight query="Dated:" styles={{ fontWeight: 'bold' }}>
                Dated:
              </Highlight>
              {type == 'in'
                ? data?.data[0]?.transaction_date
                : data?.data[0]?.posting_date}
            </Text>
          </HStack>
          <Field.Root>
            <Field.Label>{type == 'in' ? 'Supplier' : 'Customer'}</Field.Label>
            <Input
              {...register(type == 'in' ? 'supplier' : 'customer')}
              disabled
              defaultValue={
                type == 'in' ? data?.data[0]?.supplier : data?.data[0]?.customer
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
                  ? String(data?.data[0]?.billing_address_display).replaceAll(
                      '<br>',
                      '\n'
                    )
                  : String(data?.data[0]?.address_display).replaceAll(
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
              defaultValue={type == 'out' ? data?.data[0]?.name : ''}
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
              defaultValue={type == 'out' ? data?.data[0]?.posting_date : ''}
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
