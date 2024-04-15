import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const categoriesData = [
    { name: "Advertising and Marketing", type: "expense" },
    { name: "Bank Fees and Charges", type: "expense" },
    { name: "Business Travel", type: "expense" },
    { name: "Car and Truck Expenses", type: "expense" },
    { name: "Commission and Fees", type: "expense" },
    { name: "Contract Labor", type: "expense" },
    { name: "Dues and Subscriptions", type: "expense" },
    { name: "Education and Training", type: "expense" },
    { name: "Employee Benefits", type: "expense" },
    { name: "Equipment Rental", type: "expense" },
    { name: "Freight and Shipping", type: "expense" },
    { name: "Gifts", type: "expense" },
    { name: "Insurance", type: "expense" },
    { name: "Interest Expense", type: "expense" },
    { name: "Legal and Professional Fees", type: "expense" },
    { name: "Maintenance and Repairs", type: "expense" },
    { name: "Meals and Entertainment", type: "expense" },
    { name: "Office Supplies and Expenses", type: "expense" },
    { name: "Payroll Expenses", type: "expense" },
    { name: "Postage and Delivery", type: "expense" },
    { name: "Printing and Reproduction", type: "expense" },
    { name: "Rent", type: "expense" },
    { name: "Taxes and Licenses", type: "expense" },
    { name: "Telecommunications", type: "expense" },
    { name: "Utilities", type: "expense" },
    { name: "Website Expenses", type: "expense" },
    { name: "Miscellaneous", type: "expense" }
];

async function seed() {
    console.log(`Start seeding ...`);
    // console.log('started deleting existing categories...')
    // await prisma.category.deleteMany();
    // console.log('finished deleting existing categories...')
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
