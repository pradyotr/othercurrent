import { BASE_URL } from '../constants/app-constants'
import useSWR from 'swr'

const useFetchWithChildren = (doctype, docname) => {
  const fetcher = (url) => fetch(url).then((res) => res.json())
  const { data, error, isLoading } = useSWR(
    `${BASE_URL}/resource/${doctype}/${docname}`,
    fetcher
  )
  return { fetchedData: data, fetchError: error, isLoading }
}

export default useFetchWithChildren
