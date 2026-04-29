import { prisma } from '@/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const allHeaders = await headers();
    let userId = allHeaders.get("x-user-id");

    // Fallback if header is missing
    if (!userId) {
      const { auth } = await import("@/lib/auth");
      const session = await auth.api.getSession({
        headers: allHeaders,
      });
      if (session) {
        userId = session.user.id;
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify the page belongs to the user
    const page = await prisma.page.findUnique({
      where: { id },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    if (page.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.page.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const allHeaders = await headers();
    let userId = allHeaders.get("x-user-id");

    // Fallback if header is missing
    if (!userId) {
      const { auth } = await import("@/lib/auth");
      const session = await auth.api.getSession({
        headers: allHeaders,
      });
      if (session) {
        userId = session.user.id;
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { name } = await req.json();

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Valid name is required' }, { status: 400 });
    }

    // Verify the page belongs to the user
    const page = await prisma.page.findUnique({
      where: { id },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    if (page.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedPage = await prisma.page.update({
      where: { id },
      data: { name: name.trim() },
    });

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}
