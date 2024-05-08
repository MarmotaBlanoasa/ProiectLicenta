import {Client, Invoice, User} from "@prisma/client";
import {prisma} from "~/db.server";


export function getAllInvoicesByUser({userId}: { userId: User["id"] }) {
    return prisma.invoice.findMany({
        where: {userId},
        include: {
            client: true,
        },
        orderBy: {dateIssued: 'desc'},
    });
}

export function getInvoiceById({id, userId}: { id: Invoice['id'], userId: User["id"] }) {
    return prisma.invoice.findFirst({
        where: {id, userId},
        include:{
            lineItems:{select:{description:true, quantity:true, price:true, tva:true}},
            client:true
        },
        orderBy: {dateIssued: 'desc'},
    });
}

export function deleteInvoice({id, userId}: Pick<Invoice, 'id'> & { userId: User["id"] }) {
    return prisma.invoice.delete({
        where: {id, userId},
        include:{
            lineItems:true
        }
    });
}

export function addInvoice({
                               userId,
                               clientId,
                               invoiceNumber,
                               dueDate,
                               dateIssued,
                               nextBillingDate,
                               totalAmount,
                               recurring
                           }: Pick<Invoice, 'invoiceNumber' | 'dateIssued' | 'dueDate' | 'nextBillingDate' | 'totalAmount' | 'recurring'> & {
    userId: User["id"],
    clientId: Client['id']
}) {
    return prisma.invoice.create({
        data: {
            invoiceNumber,
            dateIssued,
            dueDate,
            nextBillingDate,
            totalAmount,
            recurring,
            client: {
                connect: {
                    id: clientId,
                },
            },
            user: {
                connect: {
                    id: userId,
                },
            },
        },
    });
}

export function editInvoice({
                                userId,
                                clientId,
                                id,
                                invoiceNumber,
                                dueDate,
                                dateIssued,
                                nextBillingDate,
                                totalAmount,
                                recurring,
                            }: Pick<Invoice, 'id' | 'invoiceNumber' | 'dateIssued' | 'dueDate' | 'nextBillingDate'  | 'totalAmount' | 'recurring'> & {
    userId: User["id"]
} & { clientId: Client['id'] }) {
    return prisma.invoice.update({
        where: {id, userId},
        data: {
            invoiceNumber,
            dateIssued,
            dueDate,
            nextBillingDate,
            totalAmount,
            recurring,
            client: {
                connect: {
                    id: clientId,
                }
            }
        },
    });
}

export function getInvoiceAmountAmountPaidById({id, userId}: Pick<Invoice, 'id'> & { userId: User["id"] }) {
    return prisma.invoice.findFirst({
        where: {id, userId},
        select: {paidAmount: true, totalAmount: true}
    });
}

export function updateInvoiceAmountPaidById({id, userId, paidAmount}: Pick<Invoice, 'id' | 'paidAmount'> & { userId: User["id"] }) {
    return prisma.invoice.update({
        where: {id, userId},
        data: {paidAmount: paidAmount}
    });
}

export function updateInvoiceStatusById({id, userId, status}: Pick<Invoice, 'id' | 'status'> & { userId: User["id"] }) {
    return prisma.invoice.update({
        where: {id, userId},
        data: {status}
    });
}