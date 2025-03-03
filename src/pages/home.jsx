import { Box, Button, VStack } from '@chakra-ui/react'
import { NavLink, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export default function Home() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    navigate('/login')
  }
  return (
    <Box w="100vw" justifyContent="center">
      <VStack gap="6" align="center">
        <Button size="lg" w="44" asChild bg="gray.800" color="white">
          <NavLink to="/landing/in">Material IN</NavLink>
        </Button>
        <Button size="lg" w="44" asChild bg="gray.800" color="white">
          <NavLink to="/landing/out">Material OUT</NavLink>
        </Button>
      </VStack>
    </Box>
  )
}
