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
            status: true,
            category: {select: {name: true}},
            vendor: {select: {id: true, name: true}},
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
            status: true,
            category: {select: {id:true, name: true}},
            vendor: {select: {id: true, name: true}},
            notes: true,
            lineItems:{select: {description: true, quantity: true, price: true}}
        },
    });

}

export function addBill({
                            userId,
                            date,
                            dueDate,
                            categoryId,
                            vendorId,
                            amount,
                            notes
                        }: Pick<Bill, 'date' | 'dueDate' | 'amount' | 'notes'> & {
    userId: User["id"]
} & { categoryId: Category["id"] } & { vendorId: Vendor["id"] }) {
    return prisma.bill.create({
        data: {
            date,
            dueDate,
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
                                 amount,
                                 notes
                             }: Pick<Bill, 'id' | 'date' | 'dueDate' | 'amount' | 'notes'> & {
    userId: User["id"]
} & { categoryId: Category["id"] } & { vendor: Vendor["id"] }) {
    return prisma.bill.update({
        where: {id},
        data: {
            date,
            dueDate,
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
            vendor: {select: {id: true, name: true}},
            notes: true
        },
        orderBy: {date: 'desc'},
    });
}
export function updateBillStatusById({id, userId, status}: Pick<Bill, "id" | "status"> & { userId: User["id"] }) {
    return prisma.bill.update({
        where: {id, userId},
        data: {status}
    });
}
export function updateBillAmountPaidById({id, userId, amountPaid}: Pick<Bill, "id" | "amountPaid"> & { userId: User["id"] }) {
    return prisma.bill.update({
        where: {id, userId},
        data: {amountPaid}
    });
}
export function getBillAmountAmountPaidById({id, userId}: Pick<Bill, "id"> & { userId: User["id"] }) {
    return prisma.bill.findFirst({
        where: {id, userId},
        select: {amountPaid: true, amount: true}
    });
}