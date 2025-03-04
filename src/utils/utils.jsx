import { Input, NativeSelect, Textarea } from "@chakra-ui/react"

export async function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = reject
  })
}

export function renderField(field, register, options, value, setValue) {
  switch (field?.type) {
    case 'Data':
      return (<Input
        {...register(field.fieldname, { required: field.reqd || false })}
        disabled={field.disabled}
        defaultValue={field.default}
        placeholder="Enter input here"
      />)
    case 'Date':
      return (<Input
        {...register(field.fieldname, { required: field.reqd || false })}
        disabled={field.disabled}
        defaultValue={field.default}
        type="date"
      />)
    case 'Text':
      return (<Textarea
        {...register(field.fieldname)}
        disabled
        autoresize
        maxH="10lh"
        defaultValue={String(field.default).replaceAll('<br>', '\n')}
      />)
    case 'Link':
      return <NativeSelect.Root
        
      >
        <NativeSelect.Field 
          placeholder="Select Supplier"
          {...register(field.fieldname, { required: field.reqd || false })}
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}>
          {options?.map((option, i) => {
            return <option key={option.name} value={option.name}>{option.supplier_name}</option>
          })}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
  }
}