import { Box, Button, Field, Heading, Highlight, HStack, Image, Input, Table, Text, VStack } from '@chakra-ui/react'
import { NavLink, useNavigate, useSearchParams } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { BASE_URL } from '../constants/app-constants'
import useFetchWithChildren from '../hooks/useFetchWithChildren'
import { useSWRConfig } from 'swr'
import { HiArrowLeft, HiCheckCircle } from 'react-icons/hi'
import useGetAllDocData from '../hooks/useGetAllDocData'
import PartyDetailsTab from '../components/tab-components'
import { FORM_FIELDS } from '../constants/form-metadata'

export default function SubmitPage() {
    const navigate = useNavigate()
    const [query] = useSearchParams()
    const { isAuthenticated } = useAuth()
    const { data, error } = useGetAllDocData(query.get('docname'), true)
    const { mutate } = useSWRConfig()

    const submit = async () => {
        try {
            const applySubmit = await fetch(`${BASE_URL}/resource/Gate Pass/${query.get("docname")}`, {
                method: 'PUT',
                body: JSON.stringify({
                    docstatus: 1
                })
            })
            const response = await applySubmit.json()
            mutate(`${BASE_URL}/resource/Gate Pass/${query.get("docname")}`)
        } catch (error) {
            console.log(error)
        }
    }

    // const rework = async () => {
    //     try {
    //         const deleteDoc = await fetch(`${BASE_URL}/resource/Gate Pass/${query.get("docname")}`, {
    //             method: 'DELETE'
    //         })
    //         const response = await deleteDoc.json()
    //         mutate(`${BASE_URL}/resource/Gate Pass/${query.get("docname")}`)
    //         mutate(`${BASE_URL}/resource/Gate Pass?fields=["name"]&filters=[["linked_document", "=", "${fetchedData?.data?.linked_document}"]]&order_by=creation desc`)
    //         mutate(null, { revalidate: true });
    //         if (response?.data === 'ok') navigate(-1)

    //     } catch (error) {
    //         console.log(error)
    //     }
    // }


    if (!isAuthenticated) {
        navigate('/login')
    }
    return (
        <Box>
            <Button
                m="4"
                bg="gray.800"
                size="md"
                color="white"
                rounded="md"
                onClick={() => navigate(data?.data[0]?.docstatus === 1 ? "/orders/in" : -1)}
            >
                <HiArrowLeft />Back
            </Button>
        <Box overflow="auto" w="100vw" display="flex" alignItems="center" justifyContent="center">
            { !query.get("type") || data?.data[0]?.docstatus === 1  ? <VStack w="100vw" display="flex" justifyContent="center">
                    <HStack>
                        <HiCheckCircle size="50" color="green" /> {data?.data[0]?.name}
                    </HStack>
                    <Text>Material {data?.data[0]?.gate_pass_type === 'IN'? "Inward": "Outward"} Entry Saved</Text>
                </VStack> : <VStack gap="6" align="center">
                <Heading size="xl">
                    Review
                </Heading>
                {
                    Object.entries(FORM_FIELDS[query.get('type')])?.map((entry) => {
                        return <>
                            <Heading size="lg">
                                {entry[0]}
                            </Heading>
                            {entry[0] === 'Party Details' && (
                                entry[1].map((field) => {
                                    return <Text key={field.label}>
                                        <Highlight query={field.label} styles={{ fontWeight: 'bold' }}>
                                            {`${field.label} : `}
                                        </Highlight>
                                        {data?.data[0][field.fieldname] || ""}
                                    </Text>
                                })
                            )}
                            {entry[0] === "Items" && (
                                <Box p="4">
                                    <Table.Root
                                        size="lg"
                                        variant="outline"
                                        justifyContent="center"
                                        rounded="md"
                                        padding="4"
                                    >
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.ColumnHeader>Item Name</Table.ColumnHeader>
                                                <Table.ColumnHeader w={50}>
                                                    PO Qty
                                                </Table.ColumnHeader>
                                                <Table.ColumnHeader w={50}>Unit</Table.ColumnHeader>
                                                <Table.ColumnHeader w={50}>Qty (No.)</Table.ColumnHeader>
                                                <Table.ColumnHeader w={50}>Total Qty</Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {data?.data[0]?.gate_pass_items?.map((row, i) => {
                                                return (
                                                    <Table.Row key={row.name}>
                                                        <Table.Cell>
                                                            <Input
                                                                disabled={true}
                                                                value={row.item_name}
                                                            />
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <Input
                                                                disabled={true}
                                                                value={row.quantity}
                                                            />
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <Input
                                                                disabled={true}
                                                                value={row.uom}
                                                            />
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <Input
                                                                disabled={true}
                                                                value={row.qty_no}
                                                            />
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <Input
                                                                disabled={true}
                                                                value={row.total_qty}
                                                            />
                                                        </Table.Cell>
                                                    </Table.Row>
                                                )
                                            })}
                                        </Table.Body>
                                    </Table.Root></Box>)}
                            {entry[0] === "Images" && (
                                <>{
                                    entry[1].map((field) => {
                                        return <Field.Root w="200px" key={field.fieldname} orientation="horizontal">
                                            <Field.Label>{field.label}</Field.Label>
                                            {data && data.data.length && data.data[0][field.fieldname] ? (
                                                <NavLink
                                                    to={`${BASE_URL.slice(0, BASE_URL.length - 3)}${data.data[0][field.fieldname]}`}
                                                >
                                                    <Image
                                                        h="100px"
                                                        w="100px"
                                                        src={`${String(BASE_URL).slice(0, String(BASE_URL).length - 4)}${data.data[0][field.fieldname]}`}
                                                    />
                                                </NavLink>
                                            ) : (
                                                <></>
                                            )}
                                        </Field.Root>
                                    })}

                                    {data?.data[0]?.attachments?.filter((file) => file.file_name.startsWith('_I_'))?.map((file) => {
                                        return <Field.Root w="200px" key={file.file_name} orientation="horizontal">
                                            <Field.Label>{file.file_name}</Field.Label>
                                            <NavLink
                                                to={`${BASE_URL.slice(0, BASE_URL.length - 3)}${file.file_url}`}
                                            >
                                                <Image
                                                    h="100px"
                                                    w="100px"
                                                    src={`${String(BASE_URL).slice(0, String(BASE_URL).length - 4)}${file.file_url}`}
                                                />
                                            </NavLink>
                                        </Field.Root>
                                    })

                                    }
                                </>
                            )}
                            {entry[0] === 'Documents' && (
                                data?.data[0]?.attachments?.filter((file) => file.file_name.startsWith('_D_'))?.map((file) => {
                                    return <Field.Root w="200px" key={file.file_name} orientation="horizontal">
                                        <Field.Label>{file.file_name}</Field.Label>
                                        <NavLink
                                            to={`${BASE_URL.slice(0, BASE_URL.length - 3)}${file.file_url}`}
                                        >
                                            <Image
                                                h="100px"
                                                w="100px"
                                                src={`${String(BASE_URL).slice(0, String(BASE_URL).length - 4)}${file.file_url}`}
                                            />
                                        </NavLink>
                                    </Field.Root>
                                })
                            )}
                        </>
                    })
                }
                <Box display="flex" gap="4" justifyContent="center">
                    <Button type="submit" onClick={() => submit()} color="white" bg="black">
                        Final Submit
                    </Button>
                    <Button onClick={() => navigate(-1)} type="button" borderColor="black" color="black" bg="white">
                        Edit
                    </Button>
                </Box>
            </VStack>}  
        </Box>
        </Box>
        // <Box w="100vw" justifyContent="center">
        //     <Button
        //             m="4"
        //             bg="gray.800"
        //             size="md"
        //             color="white"
        //             rounded="md"
        //             onClick={() => navigate(fetchedData?.data?.docstatus === 1 ? "/orders/in" : -1)}
        //           >
        //             <HiArrowLeft />Back
        //           </Button>
        //     {fetchedData?.data?.docstatus === 1 ? 
                // <VStack w="100vw" display="flex" justifyContent="center">
                //     <HStack>
                //         <HiCheckCircle size="50" color="green" /> {fetchedData?.data?.name}
                //     </HStack>
                //     <Text>Material {fetchedData?.data?.gate_pass_type === 'IN'? "Inward": "Outward"} Entry Saved</Text>
                // </VStack>
        //         : <VStack gap="6" align="center">
        //             <Button onClick={() => submit()} size="lg" w="44" bg="gray.800" color="white">
        //                 Final Submit
        //             </Button>
        //             <Button onClick={() => rework()} size="lg" w="44" bg="gray.800" color="white">
        //                 Rework
        //             </Button>
        //         </VStack>}
        // </Box>
    )
}
