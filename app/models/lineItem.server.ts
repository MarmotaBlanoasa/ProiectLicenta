import {prisma} from "~/db.server";
import {LineItem} from ".prisma/client";
import {Bill, Invoice, User} from "@prisma/client";
import {editInvoice} from "~/models/invoice.server";

export function addLineItem({invoiceId, billId, description, quantity, price} : Pick<LineItem, 'quantity' | 'description' | 'price'> & {invoiceId?: Invoice['id']} & {billId?: Bill['id']}) {
    return prisma.lineItem.create({
        data: {
            description,
            quantity,
            price,
            invoiceId,
            billId,
        },
    });
}

export function editLineItem({id, description, quantity, price} : Pick<LineItem, 'id' | 'quantity' | 'description' | 'price'>) {
    return prisma.lineItem.update({
        where: {id},
        data: {
            description,
            quantity,
            price,
        },
    });
}
export function getLineItemByInvoiceId({invoiceId}: {invoiceId: Invoice['id']}) {
    return prisma.lineItem.findMany({
        where: {invoiceId},
    });
}
export function deleteLineItemByInvoiceId({invoiceId}: {invoiceId: Invoice['id']}) {
    return prisma.lineItem.deleteMany({
        where: {invoiceId},
    });
}
export function deleteLineItemByBillId({billId}: {billId: Bill['id']}) {
    return prisma.lineItem.deleteMany({
        where: {billId},
    });

}
export function getLineItemByBillId({billId}: {billId: Bill['id']}) {
    return prisma.lineItem.findMany({
        where: {billId},
    });
}