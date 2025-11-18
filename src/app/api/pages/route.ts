import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET handler to fetch all pages
export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: {
        createdAt: 'asc', // Order pages by creation date
      },
    });
    return NextResponse.json(pages);
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

// POST handler to create a new page
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug } = body;

    // Basic validation
    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      );
    }

    const newPage = await prisma.page.create({
      data: {
        title,
        slug,
      },
    });

    return NextResponse.json(newPage, { status: 201 }); // 201 Created
  } catch (error) {
    console.error("Error creating page:", error);
    // Handle specific error for unique slug constraint
    if ((error as any).code === 'P2002') { // Prisma's unique constraint violation code
         return NextResponse.json({ error: 'Slug must be unique' }, { status: 409 }); // 409 Conflict
    }
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}