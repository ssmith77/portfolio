import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultEntities = [
  'Savinon Holdings LLC',
  'OpCo 1',
  'OpCo 2',
  'OpCo 3',
  'OpCo 4',
  'OpCo 5',
  'OpCo 6',
  'OpCo 7',
  'OpCo 8',
  'OpCo 9',
  'OpCo 10',
  'Management LLC (S-Corp)',
];

async function main() {
  for (const name of defaultEntities) {
    await prisma.entity.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const template = await prisma.template.upsert({
    where: { name: 'Entity Formation' },
    update: {},
    create: { name: 'Entity Formation' },
  });

  const defaultItems = [
    { title: 'File Articles of Organization', description: 'File with the Secretary of State and list Savinon Holdings LLC as the sole member where applicable.' },
    { title: 'Obtain EIN', description: 'Apply for the EIN on IRS.gov for the entity.' },
    { title: 'Open bank account', description: 'Create a dedicated checking account using the entity name and EIN.' },
    { title: 'Register agent', description: 'Secure a registered agent service for compliance.' },
    { title: 'Draft operating agreement', description: 'Prepare and sign the entity operating agreement.' },
    { title: 'Accounting ledger', description: 'Set up QuickBooks or another ledger and chart of accounts.' },
    { title: 'Intercompany agreement', description: 'Execute the management agreement with the Management S-Corp for OpCos.' },
    { title: 'Fee transfer', description: 'Establish the recurring monthly management fee transfer.' },
    { title: 'Compliance reminders', description: 'Add annual report, franchise tax, and filing due dates.' },
  ];

  const existingCount = await prisma.templateItem.count({ where: { templateId: template.id } });
  if (existingCount === 0) {
    for (const [index, item] of defaultItems.entries()) {
      await prisma.templateItem.create({
        data: {
          templateId: template.id,
          title: item.title,
          description: item.description,
          order: index + 1,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
