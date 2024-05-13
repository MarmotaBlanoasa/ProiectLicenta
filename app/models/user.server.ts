import type {Password, User} from "@prisma/client";
import bcrypt from "bcryptjs";

import {prisma} from "~/db.server";
import {accountingAccounts} from "~/utils";
import {updateAccountingAccount} from "~/models/accounting_accounts.server";

export type {User} from "@prisma/client";

export async function getUserById(id: User["id"]) {
    return prisma.user.findUnique({where: {id}});
}

export async function getUserByEmail(email: User["email"]) {
    return prisma.user.findUnique({where: {email}});
}

export async function createUser(email: User["email"], password: string, businessName: User["businessName"], phone: User["phone"], address: User["address"], taxInfo: User["taxInfo"], bankBalance: User['bankBalance'], cashBalance: User['cashBalance']) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            businessName,
            phone,
            address,
            taxInfo,
            bankBalance,
            cashBalance,
            password: {
                create: {
                    hash: hashedPassword,
                },
            },
        },
    });
    await generateAccountingAccounts(user.id);
    await updateAccountingAccount({userId: user.id, code: '5311', balance: cashBalance});
    await updateAccountingAccount({userId: user.id, code: '5121', balance: bankBalance});
    await updateAccountingAccount({userId: user.id, code: '1012', balance: bankBalance + cashBalance});
    return user
}

export async function updateInfoById(id: User["id"], businessName: User["businessName"], phone: User["phone"], address: User["address"], taxInfo: User["taxInfo"], bankBalance: User['bankBalance'], cashBalance: User['cashBalance']) {
    return prisma.user.update({
        where: {id},
        data: {businessName, phone, address, taxInfo, bankBalance, cashBalance},
    });

}

export async function updatePasswordById(id: User["id"], password: string, newPassword: string) {
    const userWithPassword = await prisma.user.findUnique({
        where: {id},
        include: {
            password: true,
        },
    });

    if (!userWithPassword || !userWithPassword.password) {
        return "USER_NOT_FOUND";
    }

    const isValid = await bcrypt.compare(password, userWithPassword.password.hash);

    if (!isValid) {
        return 'INVALID_PASSWORD';
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    return prisma.password.update({
        where: {userId: id},
        data: {hash: hashedPassword},
    });
}

export async function deleteUserByEmail(email: User["email"]) {
    return prisma.user.delete({where: {email}});
}

export async function verifyLogin(
    email: User["email"],
    password: Password["hash"],
) {
    const userWithPassword = await prisma.user.findUnique({
        where: {email},
        include: {
            password: true,
        },
    });

    if (!userWithPassword || !userWithPassword.password) {
        return null;
    }

    const isValid = await bcrypt.compare(
        password,
        userWithPassword.password.hash,
    );

    if (!isValid) {
        return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password: _password, ...userWithoutPassword} = userWithPassword;

    return userWithoutPassword;
}

export async function generateAccountingAccounts(userId: User["id"]) {
    for (const account of accountingAccounts) {
        await prisma.accountingAccount.create({
            data: {
                code: account.code,
                name: account.name,
                type: account.type,
                userId,
            },
        });
    }
}

export async function getCashBankBalance(userId: User["id"]) {
    const cash = await prisma.accountingAccount.findFirst({
        where: {userId, code: '5311'},
        select:{balance: true}
    });
    const bank = await prisma.accountingAccount.findFirst({
        where: {userId, code: '5121'},
        select:{balance: true}
    });
    return {cash, bank};
}