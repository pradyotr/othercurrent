import { Box, Button, VStack } from '@chakra-ui/react'
import { NavLink, useNavigate, useParams } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export default function Landing() {
    const { type } = useParams()
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()
    if (!isAuthenticated) {
        navigate('/login')
    }
    return (
        <Box w="100vw" justifyContent="center">
            <VStack gap="6" align="center">
                <Button size="lg" w="44" asChild bg="gray.800" color="white">
                    <NavLink to={type === 'in' ? "/orders/in" : "/orders/out" }>{ type === 'in' ? "With PO" : "Invoice"}</NavLink>
                </Button>
                <Button size="lg" w="44" asChild bg="gray.800" color="white">
                    <NavLink to={ type === 'in' ? "/in" : ""}>{ type === 'in' ? "Without PO" : "Delivery Challan"}</NavLink>
                </Button>
                <Button size="lg" w="44" asChild bg="gray.800" color="white">
                    <NavLink to="/orders/out">Stock Transfer</NavLink>
                </Button>
            </VStack>
        </Box>
    )
}
