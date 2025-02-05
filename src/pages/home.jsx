import { Box, Button, VStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export default function Home() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    navigate('/login')
  }
  return (
    <Box
      w="100vw"
      justifyContent="center"
    >
      <VStack gap="6" align="center">
        <Button
          size="lg"
          w="44" 
          asChild
          bg="gray.800"
          color="white"
        >
          <a href="/orders/in">Material IN</a>
        </Button>
        <Button
          size="lg"
          w="44" 
          asChild
          bg="gray.800"
          color="white"
        >
          <a href="/orders/out">Material OUT</a>
        </Button>
      </VStack>
    </Box>
  )
}
