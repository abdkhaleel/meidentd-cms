import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) { 
  try {
    const formData = await request.formData();

    const file = formData.get('file') as File | null;
    const sectionId = formData.get('sectionId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!sectionId) {
      return NextResponse.json({ error: 'Section ID is missing' }, { status: 400 });
    }

    const uniqueFilename = `${uuidv4()}${path.extname(file.name)}`;

    const blob = await put(`images/${uniqueFilename}`, file, {
      access: 'public',
    });

    const newImage = await prisma.image.create({
      data: {
        url: blob.url,
        altText: file.name,
        order: 0, 
        sectionId: sectionId,
      },
    });

    return NextResponse.json(newImage, { status: 201 });

  } catch (error) {
    console.error('An unexpected error occurred in upload API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}