import {prisma} from "~/db.server";
import {LineItem} from ".prisma/client";
import {Invoice} from "@prisma/client";
import {editInvoice} from "~/models/invoice.server";

export function addLineItem({invoiceId, description, quantity, price} : Pick<LineItem, 'quantity' | 'description' | 'price'> & {invoiceId: Invoice['id']}) {
    return prisma.lineItem.create({
        data: {
            description,
            quantity,
            price,
            invoice: {
                connect: {
                    id: invoiceId,
                },
            },
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