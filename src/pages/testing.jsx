import { Box, Button, Center, HStack, Input, Skeleton, Stack, Table } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import TabsComponent from '../components/ui/tabs'
import useGetData from '../hooks/useGetData'
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { debounce } from 'lodash'
import { BiSolidDownArrow, BiSolidUpArrow } from 'react-icons/bi';
import { FormSection } from '../components/ui/app-common';
import { FORM } from '../constants/metadata';
import { useForm } from 'react-hook-form';

export default function TestingPage() {

    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [sortOrder, setSortOrder] = useState(true)
    const { data, error, isLoading } = useGetData('Quality Inspection', undefined, undefined, undefined, sortOrder)
    const { register, getValues, watch } = useForm()

    const [filteredData, setFilteredData] = useState([])
    const [searchString, setSearchString] = useState('')

    if (!isAuthenticated) {
        navigate("/login");
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
                dataFlag = dataFlag.filter(
                    (item) =>
                        item.name.toLowerCase().includes(searchString.toLowerCase())
                )
            }
            setFilteredData(dataFlag)
        }
    }, [data, searchString])

    if (isLoading) {
        return (
            <Box w="100vw" display="flex" p="10" gap="20" flexDirection="column">
                <Stack flex="1">
                    <Skeleton height="5" width="100%" />
                    <Skeleton height="5" width="100%" />
                </Stack>
            </Box>
        )
    }

    return (
        <Box
            p="4"
        >
            <TabsComponent tabs={["IQC", "IN PROCESS", "PDI"]} />
            <Box w="100%" p="4" justifyContent="center">
                <Box p="4" w="6/12">
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
                                    ID
                                </Table.ColumnHeader>
                                <Table.ColumnHeader>
                                    Status
                                </Table.ColumnHeader>
                                <Table.ColumnHeader>
                                    Report Date
                                </Table.ColumnHeader>
                                <Table.ColumnHeader>
                                    Actions
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {filteredData.map((row, i) => {
                                return (
                                    <Table.Row key={row.name}>
                                        <Table.Cell>
                                            <Link
                                                variant="underline"
                                                href={`#`}
                                            >
                                                {row.name}
                                            </Link>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {row.status}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {row.report_date}
                                        </Table.Cell>
                                        <Table.Cell>
                                            Edit
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table.Root>
                </Stack>
            </Box>
            <FormSection 
                fields={FORM.TESTING.init}
                register={register}
                getValues={getValues}
                watch={watch}
            />
        </Box>
    )
}
