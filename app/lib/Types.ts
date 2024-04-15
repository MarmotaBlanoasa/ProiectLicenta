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

export type DefaultValuesInvoice = {
    invoiceNumber: string;
    dateIssued: string;
    dueDate: string;
    nextBillingDate: string | null;
    payeePayer: string;
    paidAmount: number;
    totalAmount: number;
    status: 'paid' | 'unpaid' | 'overdue';
    recurring: boolean;
    lineItems: {
        description: string;
        quantity: number;
        price: number;
    }[];
};

export const BillSchema = zod.object({
    date: zod.string().datetime(),
    dueDate: zod.string().datetime(),
    categoryId: zod.string().min(1, 'Please select a category').max(100),
    vendor: zod.string().min(1, 'Please select a vendor').max(100),
    paymentMethod: zod.string().min(1, 'Please select a payment method').max(100),
    amount: zod.number().min(0.01, 'Amount must be greater than 0'),
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
    totalAmount: zod.number(),
    status: zod.enum(['paid', 'unpaid', 'overdue']),
    recurring: zod.boolean(),
    lineItems: zod.array(lineItemSchema)
});
export const resolverInvoice = zodResolver(invoiceSchema);