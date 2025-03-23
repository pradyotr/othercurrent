import { BASE_URL } from '../constants/app-constants'
import useSWR from 'swr'

const useGetData = (
    doctype, 
    fields = '["*"]',
    filters = null,
    order_by = 'creation',
    sortOrder = true
) => {
    const fetcher = (url) => fetch(url).then((res) => res.json())
    
    const { data, error, isLoading } = useSWR(
        `${BASE_URL}/api/resource/${doctype}?fields=${fields}${ filters ? `&filters=${filters}`: ``}&order_by=${order_by} ${sortOrder ? `desc`: `asc`}&limit_page_length=None`,
        fetcher
    )

    return { data, error, isLoading }
}

export default useGetData
