import { Box, Button, Field, Heading, Image, Input, Tabs, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { FormStatusAlert } from './tab-components';
import { renderField } from '../utils/utils';
import { BASE_URL } from '../constants/app-constants';
import { NavLink } from 'react-router';
import { HiCamera } from 'react-icons/hi';
import {
    FileUploadList,
    FileUploadRoot,
    FileUploadTrigger
} from '../components/ui/file-upload'
import useFetch from '../hooks/useFetch';

export default function BottomTabs({ tabs, tabStatus, activeTab, setActiveTab }) {
    return (
        <Tabs.Root
            w="100vw"
            value={activeTab}
            onValueChange={(e) => setActiveTab(e.value)}
            position="absolute"
            bottom="0"
            fitted
            defaultValue="Party Details"
            variant="enclosed"
        >
            <Tabs.List>
                {tabs?.map((tab, i) => {
                    return <Tabs.Trigger
                        key={tab.name}
                        value={tab.name}
                        disabled={i === 0 ? false : !tabStatus[tabs[i - 1]?.name]}
                        bgColor={tabStatus[tab.name] ? "green.400" : tabStatus[tabs[i - 1]?.name] || i === 0 ? "yellow.300" : "gray.300"}
                    >
                        <Box color={tabStatus[tab.name] ? "green" : tabStatus[tabs[i - 1]?.name] || i === 0 ? "brown" : "gray"}>{tab.icon}</Box>
                    </Tabs.Trigger>
                })}
                <Tabs.Indicator rounded="l2" />
            </Tabs.List>
        </Tabs.Root>
    )
}

export function InputForm({ fields, register, errors, status, setActiveTab, nextTab }) {

    const { fetchedData, fetchError, isLoading } = useFetch('Supplier', ["name","supplier_name"])
    const [value, setValue] = useState(fields?.find((field) => field.type === 'Link')?.default || "none")

    console.log(fetchedData, value)

    return (
        <VStack w="full" gap="6" align="center">
            {fields?.map((field, i) => {
                return <Field.Root key={field.fieldname} invalid={errors[field.fieldname]}>
                    <Field.Label>
                        {field.label}
                    </Field.Label>
                    {renderField(field, register, fetchedData?.data || [], value, setValue)}
                    {errors[field.fieldname] && (<Field.ErrorText>This field is required</Field.ErrorText>)}
                </Field.Root>
            })}
            <Box display="flex" gap="4" justifyContent="center">
                <Button type="submit" color="white" bg="black">
                    Save
                </Button>
                <Button onClick={() => { if (status) setActiveTab(nextTab) }} type="button" borderColor="black" color="black" bg="white">
                    Next
                </Button>
            </Box>
        </VStack>
    )
}

export function ImagesForm({ fields, register, errors, files, status, setActiveTab, nextTab }) {
    const [addlImages, setAddlImages] = useState([])
    const img_url = String(BASE_URL).slice(0, String(BASE_URL).length - 4)

    return (
        <VStack w="full" gap="6" align="center">
            {fields.map((field, i) => {
                return <Field.Root key={field.fieldname} orientation="horizontal">
                    <Field.Label>{field.label}</Field.Label>
                    {field.default ? (
                        <NavLink
                            to={`${BASE_URL.slice(0, BASE_URL.length - 3)}${field.default}`}
                        >
                            <Image
                                h="100px"
                                w="100px"
                                src={`${img_url}${field.default}`}
                            />
                        </NavLink>
                    ) : (
                        <></>
                    )}
                    <FileUploadRoot
                        {...register(field.fieldname, { required: field.reqd && !field.default || false })}
                    >
                        <FileUploadTrigger asChild borderColor={errors[field.fieldname] ? "red" : ""}>
                            <Button type="button" variant="outline" size="sm">
                                <HiCamera /> Capture
                            </Button>
                        </FileUploadTrigger>
                        {errors[field.fieldname] ? <Text color="red">Upload File</Text> : <></>}
                        <FileUploadList />
                    </FileUploadRoot>
                </Field.Root>
            })}
            {files?.map((file, i) => {
                return (
                    <Field.Root key={i} orientation="horizontal">
                        <Field.Label>Document {i + 1}</Field.Label>
                        <NavLink
                            key={`${i}${file.file_url}`}
                            to={`${BASE_URL.slice(0, BASE_URL.length - 3)}${file.file_url}`}
                        >
                            <Image
                                h="100px"
                                w="100px"
                                src={`${BASE_URL.slice(0, BASE_URL.length - 3)}${file.file_url}`}
                            />
                        </NavLink>
                        <FileUploadRoot
                            {...register(`_I_${i + 1}_`)}
                        >
                            <FileUploadTrigger asChild>
                                <Button type="button" variant="outline" size="sm">
                                    <HiCamera /> Capture
                                </Button>
                            </FileUploadTrigger>
                            <FileUploadList />
                        </FileUploadRoot>
                    </Field.Root>
                )
            })}
            {addlImages.map((index) => {
                return (
                    <Field.Root key={index} orientation="horizontal">
                        <Field.Label>Add Image</Field.Label>
                        <FileUploadRoot
                            {...register(`_I_${index}_`)}
                        >
                            <FileUploadTrigger asChild>
                                <Button type="button" variant="outline" size="sm">
                                    <HiCamera /> Capture
                                </Button>
                            </FileUploadTrigger>
                            <FileUploadList />
                        </FileUploadRoot>
                    </Field.Root>
                )
            })}
            <Box display="flex" justifyContent="center">
                <Button
                    onClick={() =>
                        setAddlImages([...addlImages, addlImages.length + 1])
                    }
                    color="black/80"
                    rounded="md"
                    borderColor="black/30"
                    type="button"
                >
                    + Attach more images
                </Button>
            </Box>
            <Box display="flex" gap="4" justifyContent="center">
                <Button type="submit" color="white" bg="black">
                    Save
                </Button>
                <Button onClick={() => { if (status) setActiveTab(nextTab) }} type="button" borderColor="black" color="black" bg="white">
                    Next
                </Button>
            </Box>
        </VStack>
    )
}