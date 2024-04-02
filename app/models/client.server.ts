import {prisma} from "~/db.server";
import {Client, User} from "@prisma/client";

export function getAllClientsByUser({userId}: { userId: User["id"] }) {
    return prisma.client.findMany({
        where: {userId},
        select: {name: true, email: true, phone: true, address: true},
        orderBy: {name: 'asc'},
    });
}

export function getClientById({id, userId}: Pick<Client, "id"> & { userId: User["id"] }) {
    return prisma.client.findFirst({
        where: {id, userId},
        select: {name: true, email: true, phone: true, address: true, notes: true},
    });
}

export function addClient({
                              userId,
                              name,
                              email,
                              phone,
                              address,
                              notes
                          }: Pick<Client, 'name' | 'email' | 'phone' | 'address' | 'notes'> & { userId: User["id"] }) {
    return prisma.client.create({
        data: {
            name,
            email,
            phone,
            address,
            notes,
            user: {
                connect: {
                    id: userId,
                },
            },
        },
    });
}