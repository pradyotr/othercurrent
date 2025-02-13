import { BASE_URL } from '../constants/app-constants'
import useSWR from 'swr'

const useFetch = (
  doctype,
  fields = ['*'],
  filters = null,
  order_by = 'creation'
) => {
  const fetcher = (url) => fetch(url).then((res) => res.json())
  const { data, error, isLoading } = useSWR(
    `${BASE_URL}/resource/${doctype}?fields=${JSON.stringify(fields)}${filters ? `&filters=${JSON.stringify(filters)}` : ``}&order_by=${order_by}`,
    fetcher
  )
  return { fetchedData: data, fetchError: error, isLoading }
}

export default useFetch
