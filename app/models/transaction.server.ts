import {prisma} from "~/db.server";
import {Category, Transaction, User} from "@prisma/client";

export function getAllTransactionsByUser({userId}: { userId: User["id"] }) {
    return prisma.transaction.findMany({
        where: {userId},
        select: {
            date: true,
            amount: true,
            type: true,
            category: true,
            paymentMethod: true,
            payeePayer: true,
            notes: true
        },
        orderBy: {date: 'desc'},
    });
}

export function getTransactionById({id, userId}: Pick<Transaction, "id"> & { userId: User["id"] }) {
    return prisma.transaction.findFirst({
        where: {id, userId},
        select: {
            id: true,
            date: true,
            amount: true,
            type: true,
            paymentMethod: true,
            payeePayer: true,
            notes: true,
            category: true,
        },
    });
}

export function addTransaction({
                                   userId,
                                   date,
                                   type,
                                   categoryId,
                                   payeePayer,
                                   paymentMethod,
                                   amount,
                                   notes
                               }: Pick<Transaction, 'date' | 'type' | 'payeePayer' | 'paymentMethod' | 'amount' | 'notes'> & {
    userId: User["id"]
} & { categoryId: Category["id"] }) {
    return prisma.transaction.create({
        data: {
            date,
            type,
            payeePayer,
            paymentMethod,
            amount,
            notes,
            user: {
                connect: {
                    id: userId,
                },
            },
            category: {
                connect: {
                    id: categoryId
                }
            }
        },
    });
}

export function editTransactionById({
                                        id,
                                        userId,
                                        date,
                                        type,
                                        categoryId,
                                        payeePayer,
                                        paymentMethod,
                                        amount,
                                        notes
                                    }: Pick<Transaction, 'id' | 'date' | 'type' | 'payeePayer' | 'paymentMethod' | 'amount' | 'notes'> & {
    userId: User["id"]
} & { categoryId: Category["id"] }) {
    return prisma.transaction.update({
        where: {id},
        data: {
            date,
            type,
            payeePayer,
            paymentMethod,
            amount,
            notes,
            user: {
                connect: {
                    id: userId,
                },
            },
            category: {
                connect: {
                    id: categoryId
                }
            }
        },
    });
}