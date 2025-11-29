import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/prisma';


export async function POST(request: NextRequest) { 
  try {
    const formData = await request.formData();

    const file = formData.get('file') as File | null;
    const sectionId = formData.get('sectionId') as string | null;

    if (!file) {
      console.error("Upload API Error: No file found in FormData.");
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!sectionId) {
      console.error("Upload API Error: No sectionId found in FormData.");
      return NextResponse.json({ error: 'Section ID is missing' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (error) {
    }

    const uniqueFilename = `${uuidv4()}${path.extname(file.name)}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const newImage = await prisma.image.create({
      data: {
        url: `/uploads/${uniqueFilename}`,
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