import type {Password, User} from "@prisma/client";
import bcrypt from "bcryptjs";

import {prisma} from "~/db.server";

export type {User} from "@prisma/client";

export async function getUserById(id: User["id"]) {
    return prisma.user.findUnique({where: {id}});
}

export async function getUserByEmail(email: User["email"]) {
    return prisma.user.findUnique({where: {email}});
}

export async function createUser(email: User["email"], password: string, businessName: User["businessName"], phone: User["phone"], address: User["address"], taxInfo: User["taxInfo"]) {
    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
        data: {
            email,
            businessName,
            phone,
            address,
            taxInfo,
            password: {
                create: {
                    hash: hashedPassword,
                },
            },
        },
    });
}
export async function updateInfoById(id: User["id"], businessName: User["businessName"], phone: User["phone"], address: User["address"], taxInfo: User["taxInfo"]) {
    return prisma.user.update({
        where: {id},
        data: {businessName, phone, address, taxInfo},
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
