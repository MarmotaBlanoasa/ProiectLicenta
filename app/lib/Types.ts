import * as zod from "zod";

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