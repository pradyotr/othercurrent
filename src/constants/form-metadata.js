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