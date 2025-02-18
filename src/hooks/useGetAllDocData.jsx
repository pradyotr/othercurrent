'use client'
import { BASE_URL } from '../constants/app-constants'
import useSWR from 'swr'

const useGetAllDocData = (linked_document) => {
  const fetcher = async (url) => {
    const response = await fetch(url)
    const gatePassDoc = await response.json()
    if (response.status === 200 && gatePassDoc.data[0]?.name) {
      const getFiles = await fetch(
        `${BASE_URL}/resource/File?fields=["file_url","file_type","file_name"]&filters=${JSON.stringify(
          [
            ['attached_to_name', '=', gatePassDoc.data[0].name],
            ['attached_to_field', 'is', 'not set']
          ]
        )}`
      )
      const filesData = await getFiles.json()
      if (getFiles.status == 200 && filesData.data?.length > 0)
        gatePassDoc.data[0]['attachments'] = filesData.data
    }
    return gatePassDoc
  }
  const { data, error, isLoading, mutate } = useSWR(
    `${BASE_URL}/resource/Gate Pass?fields=["*"]&filters=[["linked_document", "=", "${linked_document}"]]&order_by=creation desc`,
    fetcher
  )
  return { data, error, isLoading, mutate }
}

export default useGetAllDocData
