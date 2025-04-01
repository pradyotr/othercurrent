export const FORM = {
    TESTING: {
        init: [
            {
                label: 'Roll No',
                fieldname: 'roll_no_1',
                fieldtype: 'Data',
                col: 1,
                cols: 4
            },
            {
                label: 'Product Code',
                fieldname: 'product_code_1',
                fieldtype: 'Data',
                col: 2,
                cols: 2
            },
            {
                label: 'Roll No',
                fieldname: 'roll_no_2',
                fieldtype: 'Data',
                col: 1,
                cols: 3
            },
            {
                label: 'Product Code',
                fieldname: 'product_code_2',
                fieldtype: 'Data',
                col: 2,
                cols: 2
            },
            {
                label: 'Roll No',
                fieldname: 'roll_no_3',
                fieldtype: 'Data',
                col: 1,
                cols: 2
            },
            {
                label: 'Product Code',
                fieldname: 'product_code_3',
                fieldtype: 'Data',
                col: 2,
                cols: 2
            },
            {
                label: 'Product Code',
                fieldname: 'product_code_total',
                fieldtype: 'Data',
                group: 'roll_no',
                formula: (fields, data) => { 
                    let sum = 0
                    fields?.map((field) => sum += (Number(data[field.fieldname]) || 0) )
                    return sum
                },
                col: 3,
                cols: 2
            },
            {
                label: 'Product Code',
                fieldname: 'product_code',
                fieldtype: 'Data',
                group: 'roll_no',
                formula: (fields, data) => { 
                    let sum = 0
                    let count = 0
                    fields?.map((field) => {
                        sum += (Number(data[field.fieldname]) || 0)
                        if (data[field.fieldname]) count += 1
                    })
                    return (sum/count).toFixed(2)
                },
                col: 4,
                cols: 2
            }
        ]
    }
}