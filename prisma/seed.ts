import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const categoriesData = [
    // Income Categories
    { name: 'Salary', type: 'income' },
    { name: 'Bonus', type: 'income' },
    { name: 'Interest', type: 'income' },
    { name: 'Dividends', type: 'income' },
    { name: 'Rental Income', type: 'income' },
    { name: 'Freelance', type: 'income' },

    // Expense Categories
    { name: 'Rent/Mortgage', type: 'expense' },
    { name: 'Utilities - Electricity', type: 'expense' },
    { name: 'Utilities - Water', type: 'expense' },
    { name: 'Utilities - Gas', type: 'expense' },
    { name: 'Groceries', type: 'expense' },
    { name: 'Dining Out', type: 'expense' },
    { name: 'Transportation - Fuel', type: 'expense' },
    { name: 'Transportation - Public Transport', type: 'expense' },
    { name: 'Entertainment', type: 'expense' },
    { name: 'Health Insurance', type: 'expense' },
    { name: 'Car Maintenance', type: 'expense' },
    { name: 'Travel', type: 'expense' },
    { name: 'Education', type: 'expense' },
    { name: 'Gifts & Donations', type: 'expense' },
];
async function seed() {
    console.log(`Start seeding ...`);
    for (const c of categoriesData) {
        const category = await prisma.category.create({
            data: c,
        });
        console.log(`Created category with id: ${category.id}`);
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
