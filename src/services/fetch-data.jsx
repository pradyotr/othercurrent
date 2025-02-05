import { BASE_URL } from "../constants/app-constants"
import { isObjectEmpty } from "../utils/utils"

export async function fetchData({ doctype, fields = ["*"], filters = null, order_by = null, limit_start = 1, limit_page_length = "None" }) {

    /*
        Common service to fetch data from Frappe backend
    */

    const token = localStorage.getItem('token')
    const queryParams = `fields=${JSON.stringify(fields)}&${filters ? `filters=${JSON.stringfiy(filters)}&` : ``}${order_by ? `order_by=${order_by}&`: ``}limit_start=${limit_start}&limit_page_length=${limit_page_length}`
    const response = await fetch(`${BASE_URL}/resource/${doctype}?${queryParams}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const data = await response.json()
    
    if(data.data && !isObjectEmpty(data.data))  {
        return  {
            status: response.status,
            data: data.data
        }
    }
}