import { BASE_URL } from '../constants/app-constants'
import useSWR from 'swr'

const useFetch = (type, sortOrder = true) => {
  const fetcher = (url) => fetch(url).then((res) => res.json())
  const { data, error, isLoading } = useSWR(
    type
      ? `${BASE_URL}/resource/${type === 'in' ? `Purchase Order` : `Sales Invoice`}?fields=["*"]&order_by=creation ${sortOrder ? `desc` : `asc`}&limit_page_length=None`
      : null,
    fetcher
  )

  return { data, isLoading }
}

export default useFetch
