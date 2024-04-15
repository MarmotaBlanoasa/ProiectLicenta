import {prisma} from "~/db.server";
import {Category, Expense, Merchant, User} from "@prisma/client";

export function getExpensesByUserId({ userId }: {userId: User["id"]}) {
    return prisma.expense.findMany({
        where: {
        userId,
        },
    });
}

export function addExpense({userId, amount, notes, date, categoryId, merchantId}: {
    userId: User["id"],
    categoryId: Category["id"],
    merchantId: Merchant["id"],
} & Pick<Expense, "amount" | "notes" | "date">) {
    return prisma.expense.create({
        data: {
            date,
            amount,
            notes,
            user: {
                connect: {
                    id: userId
                }
            },
            category: {
                connect: {
                    id: categoryId
                }
            },
            merchant: {
                connect: {
                    id: merchantId
                }
            }
        }
    });
}

export function getExpenseById({id, userId}: Pick<Expense, "id"> & { userId: User["id"] }) {
    return prisma.expense.findUnique({
        where: {
            id,
            userId
        }
    });
}

export function editExpenseById({id, userId, amount, notes, date, categoryId, merchantId}: {
    id: Expense["id"],
    userId: User["id"],
    categoryId: Category["id"],
    merchantId: Merchant["id"],
} & Pick<Expense, "amount" | "notes" | "date">) {
    return prisma.expense.update({
        where: {
            id,
            userId
        },
        data: {
            amount,
            notes,
            date,
            category: {
                connect: {
                    id: categoryId
                }
            },
            merchant: {
                connect: {
                    id: merchantId
                }
            }
        }
    });
}

export function deleteExpenseById({id, userId}: Pick<Expense, "id"> & { userId: User["id"] }) {
    return prisma.expense.delete({
        where: {
            id,
            userId
        }
    });
}