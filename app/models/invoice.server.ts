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
            lineItems:{select:{description:true, quantity:true, price:true}},
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
                               paidAmount,
                               totalAmount,
                               status,
                               recurring
                           }: Pick<Invoice, 'invoiceNumber' | 'dateIssued' | 'dueDate' | 'status' | 'nextBillingDate' | 'paidAmount' | 'totalAmount' | 'recurring'> & {
    userId: User["id"],
    clientId: Client['id']
}) {
    return prisma.invoice.create({
        data: {
            invoiceNumber,
            dateIssued,
            dueDate,
            nextBillingDate,
            paidAmount,
            totalAmount,
            status,
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
                                paidAmount,
                                totalAmount,
                                status,
                                recurring,
                            }: Pick<Invoice, 'id' | 'invoiceNumber' | 'dateIssued' | 'dueDate' | 'status' | 'nextBillingDate' | 'paidAmount' | 'totalAmount' | 'recurring'> & {
    userId: User["id"]
} & { clientId: Client['id'] }) {
    return prisma.invoice.update({
        where: {id, userId},
        data: {
            invoiceNumber,
            dateIssued,
            dueDate,
            nextBillingDate,
            paidAmount,
            totalAmount,
            status,
            recurring,
            client: {
                connect: {
                    id: clientId,
                }
            }
        },
    });
}