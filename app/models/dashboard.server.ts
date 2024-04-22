import {prisma} from "~/db.server";
import {User} from "@prisma/client";


export function getRecentInvoicesByUserId({userId}: { userId: User["id"] }) {
    return prisma.invoice.findMany({
        where: {userId},
        orderBy: {dateIssued: 'desc'},
        take: 5,
    });
}

export async function getOutstandingInvoicesByUserId({userId}: { userId: User["id"] }) {
    const totalOutstanding = await prisma.invoice.aggregate({
        where: {userId, status: 'unpaid'},
        orderBy: {dueDate: 'asc'},
        _sum: {
            totalAmount: true
        },
        take: 5,
    });
    const invoices = await prisma.invoice.findMany({
        where: {userId, status: 'unpaid'},
        orderBy: {dueDate: 'asc'},
        take: 5,
        include: {client: {select: {name: true}}}
    });
    return {totalOutstanding, invoices};
}

export async function getOutstandingBillsByUserId({userId}: { userId: User["id"] }) {
    const totalOutstanding = await prisma.bill.aggregate({
        where: {userId, status: 'unpaid'},
        orderBy: {dueDate: 'asc'},
        _sum: {
            amount: true
        }
    });
    const bills = await prisma.bill.findMany({
        where: {userId, status: 'unpaid'},
        orderBy: {dueDate: 'asc'},
        take: 5,
    });
    return {totalOutstanding, bills};
}

export async function getRecentPaymentsByUserId({userId}: { userId: User["id"] }) {
    return prisma.payment.findMany({
        where: {userId},
        orderBy: {paymentDate: 'desc'},
        take: 5,
    });
}

export async function getTotalExpensesByCategory({userId}: { userId: User["id"] }) {
    const expensesSumByCategory = await prisma.expense.groupBy({
        by: ['categoryId'],
        where: {userId},
        _sum: {
            amount: true
        },
    });

    return await Promise.all(
        expensesSumByCategory.map(async (expense) => {
            const category = await prisma.category.findUnique({
                where: {id: expense.categoryId},
                select: {name: true},
            });

            return {
                category: category?.name,
                totalAmount: expense._sum.amount,
            };
        })
    );
}

export async function getTotalRevenueByMonth({userId}: { userId: User["id"] }) {
    const revenueByMonth = await prisma.invoice.groupBy({
        by: ['dateIssued'],
        where: {userId , status: 'paid'},
        _sum: {
            totalAmount: true
        },
    });

    return await Promise.all(
        revenueByMonth.map(async (revenue) => {
            return {
                month: revenue.dateIssued ,
                totalAmount: revenue._sum.totalAmount,
            };
        })
    );
}