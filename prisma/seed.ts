import {PrismaClient} from "@prisma/client";
import {accountingAccounts} from "~/utils";

const prisma = new PrismaClient();


async function seed() {
    console.log(`Start seeding ...`);
    const users = await prisma.user.findMany();
    for (const user of users){
        // for (const account of accountingAccounts){
        //     await prisma.accountingAccount.create({
        //         data: {
        //             code: account.code,
        //             name: account.name,
        //             type: account.type,
        //             userId: user.id
        //         }
        //     });
        //     console.log(`Accounting account ${account.name} created for user ${user.email}`);
        // }
        const account = await prisma.accountingAccount.create({
            data: {
                code: '602',
                name: 'Cheltuieli cu materialele consumabile',
                type: 'Activ',
                userId: user.id
            }
        });
        console.log(`Accounting account ${account.name} created for user ${user.email}`);
    }
    console.log(`Seeding finished.`);
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
