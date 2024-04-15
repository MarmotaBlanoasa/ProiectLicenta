import {prisma} from "~/db.server";
import {Invoice, Payment, User} from "@prisma/client";

export function getPaymentsByUserId({ userId }: {
    userId: User["id"];
}) {
    return prisma.payment.findMany({
        where: {
            userId
        }
    });
}

export function addPayment({userId, invoiceId, amount, paymentDate, method}: {
    userId: User["id"],
    invoiceId: Invoice['id'],
} & Pick<Payment, "amount" | "paymentDate" | "method">) {
    return prisma.payment.create({
        data: {
            amount,
            paymentDate,
            method,
            user: {
                connect: {
                    id: userId
                }
            },
            invoice:{
                connect:{
                    id: invoiceId
                }
            }
        }
    });
}

export function getPaymentById({id, userId}: Pick<Payment, "id"> & { userId: User["id"] }) {
    return prisma.payment.findUnique({
        where: {
            id,
            userId
        }
    });
}

export function editPaymentById({id, userId, amount, paymentDate, method, invoiceId}: {
    userId: User["id"],
    invoiceId: Invoice['id'],
} & Pick<Payment, 'id' | "amount" | "paymentDate" | "method">) {
    return prisma.payment.update({
        where: {
            id,
            userId
        },
        data: {
            amount,
            paymentDate,
            method,
            invoice:{
                connect:{
                    id: invoiceId
                }
            }
        }
    });
}

export function deletePaymentById({id, userId}: Pick<Payment, "id"> & { userId: User["id"] }) {
    return prisma.payment.delete({
        where: {
            id,
            userId
        }
    });
}