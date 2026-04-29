import { prisma } from '@/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const allHeaders = await headers();
    let userId = allHeaders.get('x-user-id');

    // Fallback if header is missing
    if (!userId) {
      const { auth } = await import('@/lib/auth');
      const session = await auth.api.getSession({
        headers: allHeaders
      });
      if (session) {
        userId = session.user.id;
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, content } = await req.json();

    const page = await prisma.page.create({
      data: {
        name,
        content,
        userId,
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error saving page:', error);
    return NextResponse.json({ error: 'Failed to save page' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const allHeaders = await headers();
    let userId = allHeaders.get('x-user-id');
    console.log('API GET /api/pages - Header x-user-id:', userId);
    
    // Fallback if header is missing (e.g. proxy issues)
    if (!userId) {
      const { auth } = await import('@/lib/auth');
      const session = await auth.api.getSession({
        headers: allHeaders
      });
      if (session) {
        userId = session.user.id;
        console.log('API GET /api/pages - Fallback Session User:', userId);
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pages = await prisma.page.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}
