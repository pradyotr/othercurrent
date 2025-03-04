export const FORM_FIELDS = {
    with_po: {
        "Party Details": [
            {"label": "PO No.", "fieldname": "linked_document"},
            {"label":"Dated",  "fieldname": "linked_document_date"},
            {"label":"Supplier",  "fieldname":"supplier"},
            {"label":"Supplier Invoice No",  "fieldname":"supplier_invoice_no"},
            {"label":"Supplier Invoice Date",  "fieldname":"supplier_invoice_date"}
        ],
        "Items": [
            {"label":"Items",  "fieldname":"gate_pass_items"}
        ],
        "Images": [
            {"label":"Vehicle Image",  "fieldname":"vehicle_image"},
            {"label":"Material Image",  "fieldname":"material_image"}
        ],
        "Documents": []
    }
}

export const INPUT_FORM = {
    WITH_PO: [
        {
            fieldname: 'supplier',
            label: 'Supplier',
            reqd: true,
            disabled: true,
            type: 'Data'
        },
        {
            fieldname: 'supplier_invoice_no',
            label: 'Supplier Invoice No.',
            reqd: true,
            disabled: false,
            type: 'Data'
        },
        {
            fieldname: 'supplier_invoice_date',
            label: 'Supplier Invoice Date',
            reqd: true,
            disabled: false,
            type: 'Date'
        }
    ],
    WITHOUT_PO: [
        {
            fieldname: 'invoice_amount',
            label: 'Invoice Amount',
            reqd: true,
            disabled: false,
            type: 'Data'
        },
        {
            fieldname: 'supplier',
            label: 'Supplier',
            reqd: true,
            disabled: false,
            type: 'Link',
            options: 'Supplier'
        },
        {
            fieldname: 'supplier_invoice_no',
            label: 'Supplier Invoice No.',
            reqd: true,
            disabled: false,
            type: 'Data'
        },
        {
            fieldname: 'supplier_invoice_date',
            label: 'Supplier Invoice Date',
            reqd: true,
            disabled: false,
            type: 'Date'
        }
    ]
}

export const IMAGES_FORM = {
    WITH_PO: [
        {
            fieldname: 'vehicle_image',
            label: 'Image of Vehicle',
            reqd: true
        },
        {
            fieldname: 'material_image',
            label: 'Image of Material',
            reqd: true
        }
    ],
    WITHOUT_PO: [
        {
            fieldname: 'material_image',
            label: 'Image of Material',
            reqd: true
        }
    ]
}