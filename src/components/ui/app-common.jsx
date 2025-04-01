import { Field, Flex, Input, SimpleGrid } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

export function FormSection({ fields, register, getValues, watch, setValue }) {

  // const [data, setData] = useState(watch())

  // useEffect(() => {
  //   watch((value, { name, type }) => setData(value))
  // }, [watch])
  
  if (!fields) return
  

  return (
    <SimpleGrid columnGap={4} w="fit" columns={fields[0]?.cols} rowGap="4">
      {[...Array(fields[0]?.cols).keys()]?.map((column) => {

        return (
          <Flex
            key={`form-grid-column-${column}`}
            flexDirection={'column'}
            alignItems={'center'}
            spaceY={4}
          >
            {fields?.filter((field) => field.col === column + 1)?.map((field) => {

              return (
                <FormField
                  key={field.fieldname}
                  field={field}
                  register={register}
                  fields={fields}
                  watch={watch}
                  // data={data}
                  setValue={setValue}
                />
              )
            })}
          </Flex>
        )
      })}
    </SimpleGrid>
  )
}

export function FormField({ fields, field, register, watch, setValue }) {

  const values = watch(fields.filter((dep) => dep.fieldname.startsWith(field.group))?.map((i) => i.fieldname))

  useEffect(() => {
    if ('formula' in field && 'group' in field && values) {
      setValue(field.fieldname, field.formula( fields.filter((dep) => dep.fieldname.startsWith(field.group)), values))
    }
  }, [values])

  if ('formula' in field && 'group' in field) {
    
    return (
      <Field.Root h="100%" orientation="horizontal">
        <Field.Label>{field.label}</Field.Label>
        <Input {...register(field.fieldname)} flex="1" />
      </Field.Root>
    )
  }

  return (
    <Field.Root h="100%" orientation="horizontal">
      <Field.Label>{field.label}</Field.Label>
      <Input {...register(field.fieldname)} placeholder="Enter input" flex="1" />
    </Field.Root>
  )
}