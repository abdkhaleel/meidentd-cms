import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, order, pageId, parentId } = body;

    if (!title || !content || order === undefined || !pageId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, order, pageId' },
        { status: 400 }
      );
    }

    const newSection = await prisma.section.create({
      data: {
        title,
        content,
        order,
        pageId,
        parentId, 
      },
    });

    return NextResponse.json(newSection, { status: 201 });
  } catch (error) {
    console.error("Error creating section:", error);
    if ((error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Invalid pageId or parentId provided.' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Failed to create section' },
      { status: 500 }
    );
  }
}