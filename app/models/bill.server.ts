import {prisma} from "~/db.server";
import {Bill, Category, User, Vendor} from "@prisma/client";

export function getAllBillsByUser({userId}: { userId: User["id"] }) {
    return prisma.bill.findMany({
        where: {userId},
        select: {
            id: true,
            date: true,
            dueDate: true,
            amount: true,
            category: {select: {name: true}},
            paymentMethod: true,
            vendorId: true,
            notes: true,
        },
        orderBy: {date: 'desc'},
    });

}

export function getBillById({id, userId}: Pick<Bill, "id"> & { userId: User["id"] }) {
    return prisma.bill.findUnique({
        where: {userId, id},
        select: {
            id: true,
            date: true,
            dueDate: true,
            amount: true,
            category: {select: {name: true}},
            paymentMethod: true,
            vendor: {select: {id: true, name: true}},
            notes: true
        },
    });

}

export function addBill({
                            userId,
                            date,
                            dueDate,
                            categoryId,
                            vendorId,
                            paymentMethod,
                            amount,
                            notes
                        }: Pick<Bill, 'date' | 'dueDate' | 'paymentMethod' | 'amount' | 'notes'> & {
    userId: User["id"]
} & { categoryId: Category["id"] } & { vendorId: Vendor["id"] }) {
    return prisma.bill.create({
        data: {
            date,
            dueDate,
            paymentMethod,
            amount,
            notes,
            user: {
                connect: {
                    id: userId,
                },
            },
            category: {
                connect: {
                    id: categoryId
                }
            },
            vendor: {
                connect: {
                    id: vendorId
                }
            }
        },
    });
}

export function editBillById({
                                 id,
                                 userId,
                                 date,
                                 dueDate,
                                 categoryId,
                                 vendor,
                                 paymentMethod,
                                 amount,
                                 notes
                             }: Pick<Bill, 'id' | 'date' | 'dueDate' | 'paymentMethod' | 'amount' | 'notes'> & {
    userId: User["id"]
} & { categoryId: Category["id"] } & { vendor: Vendor["id"] }) {
    return prisma.bill.update({
        where: {id},
        data: {
            date,
            dueDate,
            paymentMethod,
            amount,
            notes,
            user: {
                connect: {
                    id: userId,
                },
            },
            category: {
                connect: {
                    id: categoryId
                }
            },
            vendor: {
                connect: {
                    id: vendor
                }
            }
        },
    });
}

export function deleteBillById({id, userId}: Pick<Bill, "id"> & { userId: User["id"] }) {
    return prisma.bill.delete({
        where: {id, userId}
    });
}

export function getBillsByVendorId({id: vendorId, userId}: Pick<Vendor, "id"> & { userId: User["id"] }) {
    return prisma.bill.findMany({
        where: {
            userId,
            vendorId
        },
        select: {
            id: true,
            date: true,
            dueDate: true,
            amount: true,
            category: {select: {name: true}},
            paymentMethod: true,
            vendor: {select: {id: true, name: true}},
            notes: true
        },
        orderBy: {date: 'desc'},
    });
}