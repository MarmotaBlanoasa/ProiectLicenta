import {prisma} from "~/db.server";
import {User} from "@prisma/client";
import {eachMonthOfInterval, endOfYear, format, startOfYear} from "date-fns";


export function getRecentInvoicesByUserId({userId}: { userId: User["id"] }) {
    return prisma.invoice.findMany({
        where: {userId},
        orderBy: {dateIssued: 'desc'},
        take: 5,
    });
}

// Facturi trimise cu termen de plata depasit -- creante
export async function getOutstandingInvoicesByUserId({userId}: { userId: User["id"] }) {
    const totalOutstanding = await prisma.invoice.aggregate({
        where: {userId, status: {not: 'paid'}, dueDate: {lt: new Date()}},
        orderBy: {dueDate: 'asc'},
        _sum: {
            totalAmount: true
        },
    });
    const invoices = await prisma.invoice.findMany({
        where: {userId, status: {not: 'paid'}, dueDate: {lt: new Date()}},
        orderBy: {dueDate: 'asc'},
        take: 5,
        include: {client: {select: {name: true}}}
    });
    return {totalOutstanding, invoices};
}

// Facturi primite cu termen de plata depasit -- datorii
export async function getOutstandingBillsByUserId({userId}: { userId: User["id"] }) {
    const totalOutstanding = await prisma.bill.aggregate({
        where: {userId, status: {not: 'paid'}, dueDate: {lt: new Date()}},
        orderBy: {dueDate: 'asc'},
        _sum: {
            amount: true
        }
    });
    const bills = await prisma.bill.findMany({
        where: {userId, status: {not: 'paid'}, dueDate: {lt: new Date()}},
        include:{vendor: {select: {name: true}}, accountingAccount: {select: {name: true}}},
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

export async function getProfitLossByMonth({userId}: { userId: User["id"] }) {
    const revenueByMonth = await prisma.invoice.groupBy({
        by: ['dateIssued'],
        where: {userId, status: 'paid'},
        _sum: {
            totalAmount: true
        },
    });

    const expensesByMonth = await prisma.bill.groupBy({
        by: ['date'],
        where: {userId, status: 'paid'},
        _sum: {
            amount: true
        },
    });
    const year = new Date().getFullYear();
    const months = eachMonthOfInterval({
        start: startOfYear(new Date(year, 0, 1)),
        end: endOfYear(new Date(year, 11, 31))
    }).map(date => format(date, 'yyyy-MM'));

    // Existing data fetch logic here...

    // Initialize profit/loss object with all months set to zero
    const profitLossByMonth = months.reduce((acc: any, month) => {
        acc[month] = 0;
        return acc;
    }, {});

    // Aggregate revenue and expenses
    revenueByMonth.forEach(item => {
        const month = format(new Date(item.dateIssued), 'yyyy-MM');
        profitLossByMonth[month] += item._sum.totalAmount || 0;
    });

    expensesByMonth.forEach(item => {
        const month = format(new Date(item.date), 'yyyy-MM');
        profitLossByMonth[month] -= item._sum.amount || 0;
    });

    // Convert to array format expected by the frontend
    return Object.keys(profitLossByMonth).map(month => ({
        month,
        profitLoss: profitLossByMonth[month]
    }));

}

export async function getAllAccountBalances(userId: string) {
    // Fetch all accounts with their current balances
    const accounts = await prisma.accountingAccount.findMany({
        where: {
            userId,
            OR: [
                {
                    code: {
                        startsWith: '61'
                    }
                },
                {
                    code: {
                        startsWith: '62'
                    }
                },
                {
                    code: '704'
                }
            ]
        },
        select: {
            code: true,
            name: true,
            balance: true
        }
    })

    const totalExpensesAccounts61 = accounts.filter(account => account.code.startsWith('61')).reduce((total, account) => total + account.balance, 0);
    const totalExpensesAccounts62 = accounts.filter(account => account.code.startsWith('62')).reduce((total, account) => total + account.balance, 0);
    const revenue = accounts.find(account => account.code === '704')?.balance || 0

    return {
        accounts,
        totalProfitOrLoss: revenue - (totalExpensesAccounts61 + totalExpensesAccounts62)
    };
}