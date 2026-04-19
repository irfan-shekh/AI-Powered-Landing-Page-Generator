import { prisma } from '@/lib/auth';
import { LandingPageRenderer } from '@/components/landing-page/Renderer';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function PreviewPage({ params }: { params: { id: string } }) {
  const page = await prisma.page.findUnique({
    where: { id: params.id },
  });

  if (!page) {
    notFound();
  }

  // @ts-ignore
  const data = page.content as unknown as LandingPageData;

  return (
    <div>
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="h-4 w-px bg-gray-300"></div>
          <span className="text-sm font-medium text-gray-900">{page.name}</span>
        </div>
      </div>
      <LandingPageRenderer data={data} />
    </div>
  );
}
