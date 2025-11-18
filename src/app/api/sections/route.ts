// src/app/api/sections/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST handler to create a new section (top-level or nested)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Destructure all the fields a section can have
    const { title, content, order, pageId, parentId } = body;

    // Basic validation
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
        pageId, // Link to the parent Page
        parentId, // Link to the parent Section (will be null if it's a top-level section)
      },
    });

    return NextResponse.json(newSection, { status: 201 });
  } catch (error) {
    console.error("Error creating section:", error);
    // This can happen if the pageId or parentId provided does not exist
    if ((error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Invalid pageId or parentId provided.' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Failed to create section' },
      { status: 500 }
    );
  }
}