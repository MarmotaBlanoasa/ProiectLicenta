import {prisma} from "~/db.server";
import {Client, User} from "@prisma/client";

export function getAllClientsByUser({userId}: { userId: User["id"] }) {
    return prisma.client.findMany({
        where: {userId},
        select: {id:true, name: true, email: true, phone: true, address: true, notes: true},
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
export function updateClient({
                                 userId,
                                 id,
                                 name,
                                 email,
                                 phone,
                                 address,
                                 notes
                             }: Pick<Client, 'id' | 'name' | 'email' | 'phone' | 'address' | 'notes'> & { userId: User["id"] }) {
    return prisma.client.update({
        where: {id, userId},
        data: {name, email, phone, address, notes},
    });
}
export function deleteClient({id, userId}: Pick<Client, "id"> & { userId: User["id"] }) {
    return prisma.client.delete({where: {id, userId}});
}