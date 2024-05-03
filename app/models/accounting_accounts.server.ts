import {prisma} from "~/db.server";
import {AccountingAccount, User} from "@prisma/client";

export function getAllCategories() {
    return prisma.category.findMany();
}

export function getAllExpenseAccounts({userId} : {userId: User["id"]}) {
    return prisma.accountingAccount.findMany({
        where: {
            userId,
            code: {
                startsWith: '6'
            },
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
export function updateAccountingAccountById({id, balance}: {id: AccountingAccount['id'], balance: AccountingAccount['balance']}) {
    return prisma.accountingAccount.update({
        where: {id},
        data: {balance},
    });
}
export async function updateAccountingAccount({userId,code, balance}: { code: AccountingAccount['code'], userId: User['id'], balance: AccountingAccount['balance']}) {
    const account = await prisma.accountingAccount.findFirst({
        where: {userId, code},
    });
    return prisma.accountingAccount.update({
        where: {id :account?.id},
        data: {balance},
    });
}