import {Merchant, User} from "@prisma/client";
import {prisma} from "~/db.server";

export function getMerchantsByUserId({userId}: {
    userId: User["id"];
}) {
    return prisma.merchant.findMany({
        where: {
            userId
        }
    });
}

export function addMerchant({userId, name}: { userId: User['id'], name: Merchant['name'] }) {
    return prisma.merchant.create({
        data: {
            name,
            user: {
                connect: {
                    id: userId
                }
            }
        }
    })
}

export function deleteMerchantByName({userId, name}: { userId: User['id'], name: Merchant['name'] }) {
    return prisma.merchant.deleteMany({
        where: {
            userId,
            name
        }
    })
}

export function getMerchantsByName({userId, name}: { userId: User['id'], name: Merchant['name'] }) {
    return prisma.merchant.findFirst({
        where: {
            userId,
            name
        }
    })
}