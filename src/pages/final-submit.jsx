import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react'
import { NavLink, useNavigate, useSearchParams } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { BASE_URL } from '../constants/app-constants'
import useFetchWithChildren from '../hooks/useFetchWithChildren'
import { useSWRConfig } from 'swr'
import { HiCheckCircle } from 'react-icons/hi'

export default function SubmitPage() {
    const navigate = useNavigate()
    const [query] = useSearchParams()
    const { isAuthenticated } = useAuth()
    const { fetchedData, fetchError, isLoading } = useFetchWithChildren(
        `Gate Pass`,
        query.get('docname')
    )
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

    const rework = async () => {
        try {
            const deleteDoc = await fetch(`${BASE_URL}/resource/Gate Pass/${query.get("docname")}`, {
                method: 'DELETE'
            })
            const response = await deleteDoc.json()
            mutate(`${BASE_URL}/resource/Gate Pass/${query.get("docname")}`)
            mutate(`${BASE_URL}/resource/Gate Pass?fields=["name"]&filters=[["linked_document", "=", "${fetchedData?.data?.linked_document}"]]&order_by=creation desc`)
            if(response?.data === 'ok') navigate(-1)
            
        } catch (error) {
            console.log(error)
        }
    }


    if (!isAuthenticated) {
        navigate('/login')
    }
    return (
        <Box w="100vw" justifyContent="center">
            {fetchedData?.data?.docstatus === 1 ? 
                <VStack w="100vw" display="flex" justifyContent="center">
                    <HStack>
                        <HiCheckCircle size="50" color="green" /> {fetchedData?.data?.name}
                    </HStack>
                    <Text>Material Entry Saved</Text>
                </VStack>
                : <VStack gap="6" align="center">
                    <Button onClick={() => submit()} size="lg" w="44" bg="gray.800" color="white">
                        Final Submit
                    </Button>
                    <Button onClick={() => rework()} size="lg" w="44" bg="gray.800" color="white">
                        Rework
                    </Button>
                </VStack>}
        </Box>
    )
}
