
import { prisma } from '../src/lib/auth';

async function main() {
  const pages = await prisma.page.findMany({
    select: {
      id: true,
      name: true,
      content: true,
    }
  });
  console.log(JSON.stringify(pages, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
