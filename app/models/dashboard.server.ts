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
        where: {userId, status: {not: 'paid'}},
        orderBy: {dueDate: 'asc'},
        _sum: {
            totalAmount: true
        },
        take: 5,
    });
    const invoices = await prisma.invoice.findMany({
        where: {userId, status: {not: 'paid'}},
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
        where: {userId, status: 'paid'},
        _sum: {
            totalAmount: true
        },
    });

    return await Promise.all(
        revenueByMonth.map(async (revenue) => {
            return {
                month: revenue.dateIssued,
                totalAmount: revenue._sum.totalAmount,
            };
        })
    );
}

export async function getProfitLoss({userId}: { userId: User["id"] }) {
    const invoices = await prisma.invoice.findMany({
        where: {
            userId: userId,
            status: 'paid',
        },
        select: {
            dateIssued: true,
            totalAmount: true
        }
    });

    const groupedByMonth = invoices.reduce((acc, invoice) => {
        const month = invoice.dateIssued.getMonth(); // getMonth is zero-indexed, January is 0
        const year = invoice.dateIssued.getFullYear();
        const key = `${year}-${month + 1}`; // Creating a string key like '2021-9'

        if (!acc[key]) {
            acc[key] = {
                totalAmount: 0,
                count: 0,
                year,
                month: month + 1
            };
        }

        acc[key].totalAmount += invoice.totalAmount;
        acc[key].count += 1;

        return acc;
    }, {});
    const monthlyExpenses = await prisma.$queryRaw`SELECT EXTRACT(MONTH FROM date) AS month, SUM(amount) as totalExpenses
                                                   FROM (
                                                       SELECT date, amount FROM expenses WHERE userId = ${userId}
                                                       UNION ALL
                                                       SELECT date, amountPaid as amount FROM bills WHERE userId = ${userId}
                                                       ) AS combined
                                                   GROUP BY EXTRACT (MONTH FROM date)`;

    return {monthlyRevenue, monthlyExpenses};
}