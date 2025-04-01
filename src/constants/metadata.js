export const FORM = {
    TESTING: {
        'info': [
            {
                label: 'Inspection ID',
                fieldname: 'name',
                fieldtype: 'Data',
                col: 1,
                cols: 1
            }
        ],
        'init': [
            {
                label: 'Roll No',
                fieldname: 'roll_no',
                fieldtype: 'Data',
                col: 1,
                cols: 2
            },
            {
                label: 'Product Code',
                fieldname: 'product_code',
                fieldtype: 'Data',
                col: 1,
                cols: 2
            },
            {
                label: 'Test Date',
                fieldname: 'test_date',
                fieldtype: 'Date',
                col: 1,
                cols: 2 
            },
            {
                label: 'Tested By',
                fieldname: 'tested_by',
                fieldtype: 'Data',
                col: 1,
                cols: 2
            },
            {
                label: 'Product Code Internal',
                fieldname: 'product_code_internal',
                fieldtype: 'Data',
                col: 2,
                cols: 2
            },
            {
                label: 'Adhesive Name',
                fieldname: 'adhesive_name',
                fieldtype: 'Data',
                col: 2,
                cols: 2
            },
            {
                label: 'Adhesive Batch No.',
                fieldname: 'adhesive_batch_no',
                fieldtype: 'Data',
                col: 2,
                cols: 2
            },
        ],
        'Total GSM': [
            {
                label: 'Total GSM 1',
                fieldname: 'total_gsm_1',
                fieldtype: 'Data',
                col: 1,
                cols: 3
            },
            {
                label: 'Total GSM 2',
                fieldname: 'total_gsm_2',
                fieldtype: 'Data',
                col: 1,
                cols: 3
            },
            {
                label: 'Total GSM 3',
                fieldname: 'total_gsm_3',
                fieldtype: 'Data',
                col: 1,
                cols: 3
            },
            {
                label: 'Total GSM 4',
                fieldname: 'total_gsm_4',
                fieldtype: 'Data',
                col: 1,
                cols: 3
            },
            {
                label: 'Total GSM 5',
                fieldname: 'total_gsm_5',
                fieldtype: 'Data',
                col: 1,
                cols: 3
            },
            {
                label: 'Total GSM 6',
                fieldname: 'total_gsm_6',
                fieldtype: 'Data',
                col: 1,
                cols: 3
            },
            {
                label: 'Total GSM 7',
                fieldname: 'total_gsm_7',
                fieldtype: 'Data',
                col: 1,
                cols: 3
            },
            {
                label: 'Total GSM 8',
                fieldname: 'total_gsm_8',
                fieldtype: 'Data',
                col: 1,
                cols: 3
            },
            {
                label: 'Total GSM',
                fieldname: 'total_gsm',
                fieldtype: 'Data',
                group: 'total_gsm_',
                formula: (fields, data) => { 
                    let sum = 0
                    fields?.map((field, i) => sum += (Number(data[i]) || 0) )
                    return sum
                },
                col: 2,
                cols: 3
            },
            {
                label: 'Average GSM',
                fieldname: 'average_gsm',
                fieldtype: 'Data',
                group: 'total_gsm_',
                formula: (fields, data) => { 
                    let sum = 0
                    let count = 0
                    fields?.map((field, i) => {
                        sum += (Number(data[i]) || 0)
                        if (data[i]) count += 1
                    })
                    
                    return count ? (sum/count).toFixed(2) : 0
                },
                col: 3,
                cols: 3
            }
        ],
        'Total Thickness': [
            {
                label: 'Total Thickness 1',
                fieldname: 'total_thickness_1',
                fieldtype: 'Data',
                col: 1,
                cols: 3
            },
            {
                label: 'Total Thickness 2',
                fieldname: 'total_thickness_2',
                fieldtype: 'Data',
                col: 1,
                cols: 3
            },
            {
                label: 'Total Thickness 3',
                fieldname: 'total_thickness_3',
                fieldtype: 'Data',
                col: 1,
                cols: 3
            },
            {
                label: 'Total Thickness 4',
                fieldname: 'total_thickness_4',
                fieldtype: 'Data',
                col: 1,
                cols: 3
            },
            {
                label: 'Total Thickness 5',
                fieldname: 'total_thickness_5',
                fieldtype: 'Data',
                col: 1,
                cols: 3
            },
            {
                label: 'Total Thickness 6',
                fieldname: 'total_thickness_6',
                fieldtype: 'Data',
                col: 1,
                cols: 3
            },
            {
                label: 'Total Thickness 7',
                fieldname: 'total_thickness_7',
                fieldtype: 'Data',
                col: 1,
                cols: 3
            },
            {
                label: 'Total Thickness 8',
                fieldname: 'total_thickness_8',
                fieldtype: 'Data',
                col: 1,
                cols: 3
            },
            {
                label: 'Total Thickness',
                fieldname: 'total_thickness',
                fieldtype: 'Data',
                group: 'total_thickness_',
                formula: (fields, data) => { 
                    let sum = 0
                    fields?.map((field, i) => sum += (Number(data[i]) || 0) )
                    return sum
                },
                col: 2,
                cols: 3
            },
            {
                label: 'Average Thickness',
                fieldname: 'average_thickness',
                fieldtype: 'Data',
                group: 'total_thickness_',
                formula: (fields, data) => { 
                    let sum = 0
                    let count = 0
                    fields?.map((field, i) => {
                        sum += (Number(data[i]) || 0)
                        if (data[i]) count += 1
                    })
                    return count ? (sum/count).toFixed(2) : 0
                },
                col: 3,
                cols: 3
            }
        ],
        'Adh. Coat Weight': [
            {
                label: 'Adh. Coat Weight 1',
                fieldname: 'adh_coat_weight_1',
                fieldtype: 'Data',
                col: 1,
                cols: 3
            },
            {
                label: 'Adh. Coat Weight 2',
                fieldname: 'adh_coat_weight_2',
                fieldtype: 'Data',
                col: 1,
                cols: 3
            },
            {
                label: 'Adh. Coat Weight 3',
                fieldname: 'adh_coat_weight_3',
                fieldtype: 'Data',
                col: 1,
                cols: 3
            },
            {
                label: 'Adh. Coat Weight 4',
                fieldname: 'adh_coat_weight_4',
                fieldtype: 'Data',
                col: 1,
                cols: 3
            },
            {
                label: 'Adh. Coat Weight 5',
                fieldname: 'adh_coat_weight_5',
                fieldtype: 'Data',
                col: 1,
                cols: 3
            },
            {
                label: 'Adh. Coat Weight 6',
                fieldname: 'adh_coat_weight_6',
                fieldtype: 'Data',
                col: 1,
                cols: 3
            },
            {
                label: 'Adh. Coat Weight 7',
                fieldname: 'adh_coat_weight_7',
                fieldtype: 'Data',
                col: 1,
                cols: 3
            },
            {
                label: 'Adh. Coat Weight 8',
                fieldname: 'adh_coat_weight_8',
                fieldtype: 'Data',
                col: 1,
                cols: 3
            },
            {
                label: 'Total Adh. Coat Weight',
                fieldname: 'total_adh_coat_weight',
                fieldtype: 'Data',
                group: 'adh_coat_weight_',
                formula: (fields, data) => { 
                    let sum = 0
                    fields?.map((field, i) => sum += (Number(data[i]) || 0) )
                    return sum
                },
                col: 2,
                cols: 3
            },
            {
                label: 'Average Adh. Coat Weight',
                fieldname: 'average_adh_coat_weight',
                fieldtype: 'Data',
                group: 'adh_coat_weight_',
                formula: (fields, data) => { 
                    let sum = 0
                    let count = 0
                    fields?.map((field, i) => {
                        sum += (Number(data[i]) || 0)
                        if (data[i]) count += 1
                    })
                    
                    return count ? (sum/count).toFixed(2) : 0
                },
                col: 3,
                cols: 3
            }
        ],
        'FP/RL': [
            {
                label: 'Face GSM',
                fieldname: 'face_gsm',
                fieldtype: 'Data',
                col: 1,
                cols: 2
            },
            {
                label: 'Face Thickness',
                fieldname: 'face_thickness',
                fieldtype: 'Data',
                col: 1,
                cols: 2
            },
            {
                label: 'Release Liner GSM',
                fieldname: 'release_liner_gsm',
                fieldtype: 'Data',
                col: 2,
                cols: 2
            },
            {
                label: 'Release Liner Thickness',
                fieldname: 'release_liner_thickness',
                fieldtype: 'Data',
                col: 2,
                cols: 2
            }
        ],
        'Release Value': [
            {
                label: 'Release Value MD (Avg.)',
                fieldname: 'release_value_md_avg',
                fieldtype: 'Data',
                col: 1,
                cols: 2
            },
            {
                label: 'Release Value MD (Max.)',
                fieldname: 'release_value_md_max',
                fieldtype: 'Data',
                col: 1,
                cols: 2
            },
            {
                label: 'Release Liner GSM',
                fieldname: 'release_liner_gsm',
                fieldtype: 'Data',
                col: 2,
                cols: 2
            },
            {
                label: 'Release Liner Thickness',
                fieldname: 'release_liner_thickness',
                fieldtype: 'Data',
                col: 2,
                cols: 2
            }
        ],
        'Peel Value': [
            {
                label: 'Peel Value (Avg.)',
                fieldname: 'peel_value_avg',
                fieldtype: 'Data',
                col: 1,
                cols: 1
            },
            {
                label: 'Peel Value (Max.)',
                fieldname: 'fpeel_value_max',
                fieldtype: 'Data',
                col: 1,
                cols: 1
            }
        ],
        'Others': [
            {
                label: 'Loop Tack',
                fieldname: 'loop_tack',
                fieldtype: 'Data',
                col: 1,
                cols: 1
            },
            {
                label: 'Roll Ball',
                fieldname: 'roll_ball',
                fieldtype: 'Data',
                col: 1,
                cols: 1
            },
            {
                label: 'Sheer Value',
                fieldname: 'sheer_value',
                fieldtype: 'Data',
                col: 1,
                cols: 1
            },
            {
                label: 'Remarks',
                fieldname: 'remarks',
                fieldtype: 'Data',
                col: 1,
                cols: 1
            }
        ]
    }
}