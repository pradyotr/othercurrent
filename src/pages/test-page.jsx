import { Box } from '@chakra-ui/react'
import React from 'react'
import { FORM } from '../constants/metadata'
import { FormSection } from '../components/ui/app-common'
import { useForm } from 'react-hook-form'
import { postData } from '../utils/postDataService'

export default function TestPage() {
    const { register, getValues, watch, handleSubmit, setValue } = useForm()


    return (
        <Box>
            <form onSubmit={handleSubmit((data) => postData(data))}>
                {Object.entries(FORM.TESTING)?.map((entry) => {
                    return (
                        <FormSection
                            fields={entry[1]}
                            register={register}
                            getValues={getValues}
                            watch={watch}
                            setValue={setValue}
                        />
                    )
                })}
                <button>Save</button>
            </form>
        </Box>
    )
}
