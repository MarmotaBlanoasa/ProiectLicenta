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