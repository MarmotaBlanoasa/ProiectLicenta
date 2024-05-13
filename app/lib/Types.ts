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
    recurring: boolean;
    lineItems: {
        description: string;
        quantity: number;
        price: number;
        tva: number;
    }[];
};

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
    quantity: zod.number().nullable(),
    price: zod.number().nullable(),
    tva: zod.number().nullable(),
});
export const invoiceSchema = zod.object({
    invoiceNumber: zod.string(),
    dateIssued: zod.string().datetime(),
    dueDate: zod.string().datetime(),
    nextBillingDate: zod.string().datetime().optional().nullable(),
    payeePayer: zod.string(),
    recurring: zod.boolean(),
    lineItems: zod.array(lineItemSchema)
});
export const resolverInvoice = zodResolver(invoiceSchema);

export const BillSchema = zod.object({
    date: zod.string().datetime(),
    dueDate: zod.string().datetime(),
    accountingAccountId: zod.string().min(1, 'Please select a category').max(100),
    vendor: zod.string().min(1, 'Please select a vendor').max(100),
    notes: zod.string().optional(),
    lineItems: zod.array(lineItemSchema)
});

export const vendorSchema= zod.object({
    name: zod.string(),
    email: zod.string().email(),
    phone: zod.string().optional().nullable(),
    address: zod.string().optional().nullable(),
    website: zod.string().optional().nullable()
});

export const resolverVendor = zodResolver(vendorSchema);

export const expenseSchema = zod.object({
    date: zod.string().datetime(),
    notes: zod.string().optional().nullable(),
    amount: zod.number().min(0.01, 'Amount must be greater than 0'),
    categoryId: zod.string().min(1, 'Please select a category').max(100),
    merchantName: zod.string().min(1, 'Please enter a merchant name').max(100),
})

export const resolverExpense = zodResolver(expenseSchema);

export const paymentSchema = zod.object({
    paymentDate: zod.string().datetime(),
    amount: zod.number().min(0.01, 'Amount must be greater than 0'),
    method: zod.string().min(1, 'Please select a payment method'),
    billId: zod.string().optional().nullable(),
    invoiceId: zod.string().optional().nullable(),
})

export const resolverPayment = zodResolver(paymentSchema);