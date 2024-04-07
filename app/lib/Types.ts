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