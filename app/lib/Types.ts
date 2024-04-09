import * as zod from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

export type User = {
    id: string;
    email: string;
    businessName: string;
    phone: string;
    address: string;
    taxInfo: string;
};

export const TransactionSchema = zod.object({
    date: zod.string().datetime(),
    type: zod.enum(['expense', 'income']),
    categoryId: zod.string(),
    payeePayer: zod.string(),
    paymentMethod: zod.string(),
    amount: zod.number(),
    notes: zod.string().optional(),
});
export const ClientSchema = zod.object({
    name: zod.string(),
    email: zod.string().email(),
    phone: zod.string(),
    address: zod.string(),
    notes: zod.string(),
});
export const resolverClient = zodResolver(ClientSchema);

export const lineItemSchema = zod.object({
    description: zod.string(),
    quantity: zod.number(),
    price: zod.number()
});
export const invoiceSchema = zod.object({
    invoiceNumber: zod.string(),
    dateIssued: zod.string().datetime(),
    dueDate: zod.string().datetime(),
    nextBillingDate: zod.string().datetime().optional().nullable(),
    payeePayer: zod.string(),
    paidAmount: zod.number(),
    status: zod.enum(['paid', 'unpaid', 'overdue']),
    recurring: zod.boolean(),
    lineItems: zod.array(lineItemSchema)
});
export const resolverInvoice = zodResolver(invoiceSchema);