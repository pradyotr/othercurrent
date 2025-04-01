import { BASE_URL } from "../constants/app-constants"
import lodash from 'lodash'

export async function postData(
    formData,
    dt = 'Quality Inspection',
    template = 'QI - INPROCESS - Label Stock',
) {

    formData = lodash.pickBy(formData, function (value, key) { return value != ""})
    if (dt === 'Quality Inspection') {
        const get = await fetch(`${BASE_URL}/api/resource/Quality Inspection Template/${template}`)
        const getData = await get.json()
        const readings = []
        Object.entries(formData)?.map((entry) => {
            const row = getData?.data?.item_quality_inspection_parameter?.find((row) => row.specification.toLowerCase().replaceAll('.','').replaceAll(' ', '_') === entry[0])
            if (row) {
                const tableRow = { 'reading_value': entry[1] }
                tableRow['idx'] = row.idx
                readings.push(tableRow)
            }
        })
        formData['readings'] = readings
    }

    return 
}