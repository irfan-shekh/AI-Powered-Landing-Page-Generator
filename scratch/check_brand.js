
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pages = await prisma.page.findMany({
    take: 5,
  });
  pages.forEach(p => {
    console.log(`Page: ${p.name}`);
    console.log(`Brand: ${JSON.stringify(p.content.brand)}`);
    console.log('---');
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
