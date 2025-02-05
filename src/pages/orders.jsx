import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
  Box,
  Button,
  Center,
  HStack,
  Input,
  Stack,
  Table
} from '@chakra-ui/react'
import { BiSolidDownArrow, BiSolidUpArrow } from 'react-icons/bi'
import { useAuth } from '../hooks/useAuth'
import { debounce } from 'lodash'
import useFetch from '../hooks/useFetch'
export default function Orders() {
  const { type } = useParams()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [sortOrder, setSortOrder] = useState(true)
  const { data, isLoading } = useFetch(type, sortOrder)

  const [filteredData, setFilteredData] = useState([])
  const [searchString, setSearchString] = useState('')

  if (!isAuthenticated) {
    navigate('/login')
  }

  const handleSearch = debounce((str) => {
    setSearchString(str)
  }, 500)
  const handleSort = () => {
    setSortOrder(!sortOrder)
  }

  useEffect(() => {
    if (data) {
      let dataFlag = [...data.data]
      if (searchString) {
        const fieldname = type === 'in' ? 'supplier_name' : 'customer_name'
        dataFlag = dataFlag.filter(
          (item) =>
            item.name.toLowerCase().includes(searchString.toLowerCase()) ||
            item[fieldname].toLowerCase().includes(searchString.toLowerCase())
        )
      }
      setFilteredData(dataFlag)
    }
  }, [data, searchString])

  if (isLoading) {
    return <div>Loading data...</div>
  }

  return (
    <>
      <Box w="100vw" p="4" justifyContent="center">
        <Box p="4">
          <HStack gap="4">
            <Input
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search"
              rounded="md"
            />
            <Button
              onClick={() => handleSort()}
              p="2"
              bg="gray.800"
              size="md"
              color="white"
              rounded="md"
              textStyle="md"
            >
              <Center>
                {sortOrder ? <BiSolidDownArrow /> : <BiSolidUpArrow />}
              </Center>
              Date created
            </Button>
          </HStack>
        </Box>
        <Stack>
          <Table.Root
            size="lg"
            variant="outline"
            justifyContent="center"
            rounded="md"
          >
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>
                  {type === 'in' ? 'Purchase Order No.' : 'Sales Invoice No.'}
                </Table.ColumnHeader>
                <Table.ColumnHeader>
                  {type === 'in' ? 'Supplier Name' : 'Customer Name'}
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredData.map((row, i) => {
                return (
                  <Table.Row key={row.name}>
                    <Table.Cell>{row.name}</Table.Cell>
                    <Table.Cell>
                      {type === 'in' ? row.supplier_name : row.customer_name}
                    </Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table.Root>
        </Stack>
      </Box>
    </>
  )
}
