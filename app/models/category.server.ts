import {prisma} from "~/db.server";

export function getAllCategories() {
    return prisma.category.findMany();
}