import {prisma} from "~/db.server";
import {AccountingAccount, User} from "@prisma/client";

export function getAllExpenseAccounts({userId} : {userId: User["id"]}) {
    return prisma.accountingAccount.findMany({
        where: {
            userId,
            OR: [
                {code: {startsWith: '62'}},
                {code: {startsWith: '61'}},
            ],
        },
    });
}


export function getAllStockAccounts({userId} : {userId: User["id"]}) {
    return prisma.accountingAccount.findMany({
        where: {
            userId,
            code: {
                startsWith: '3'
            },
        },
    });
}
export async function updateAccountingAccountById({id, balance}: {id: AccountingAccount['id'], balance: AccountingAccount['balance']}) {
    const account = await prisma.accountingAccount.findFirst({
        where: {id},
    });
    return prisma.accountingAccount.update({
        where: {id},
        data: {balance: (account?.balance || 0) + balance},
    });
}

export async function updateAccountingAccount({userId,code, balance}: { code: AccountingAccount['code'], userId: User['id'], balance: AccountingAccount['balance']}) {
    const account = await prisma.accountingAccount.findFirst({
        where: {userId, code},
    });
    return prisma.accountingAccount.update({
        where: {id :account?.id},
        data: {balance: (account?.balance || 0) + balance},
    });
}