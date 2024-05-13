import {User, Vendor} from "@prisma/client";
import {prisma} from "~/db.server";

export function getVendorsByUserId(userId: User["id"]) {
    return prisma.vendor.findMany({
        where: {
            userId
        }
    });
}

export function addVendor({userId, name, email, phone, address, website}: {
    userId: User["id"],
} & Pick<Vendor, "name" | "email" | "phone" | "address" | "website">) {
    return prisma.vendor.create({
        data: {
            name,
            email,
            phone,
            address,
            website,
            user: {
                connect: {
                    id: userId
                }
            }
        }
    });
}

export function getVendorById({id, userId}: Pick<Vendor, "id"> & { userId: User["id"] }) {
    return prisma.vendor.findUnique({
        where: {
            id,
            userId
        }
    });
}

export function updateVendorById({id, userId, name, email, phone, address, website}: {
    id: Vendor["id"],
    userId: User["id"],
} & Pick<Vendor, "name" | "email" | "phone" | "address" | "website">) {
    return prisma.vendor.update({
        where: {
            id,
            userId
        },
        data: {
            name,
            email,
            phone,
            address,
            website
        }
    });
}

export function deleteVendorById({id, userId}: Pick<Vendor, "id"> & { userId: User["id"] }) {
    return prisma.vendor.delete({
        where: {
            id,
            userId
        }
    });
}

