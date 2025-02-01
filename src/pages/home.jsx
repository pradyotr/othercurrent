import { Heading } from '@chakra-ui/react'
import { useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export default function Home() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    navigate('/login')
  }
  return <Heading as="h1">Home</Heading>
}
