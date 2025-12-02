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
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!sectionId) {
      return NextResponse.json({ error: 'Section ID is missing' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'documents');
    
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (error) {
        console.error('Error creating upload directory:', error);
    }

    const uniqueFilename = `${uuidv4()}${path.extname(file.name)}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    const buffer = Buffer.from(await file.arrayBuffer());

    await fs.writeFile(filePath, buffer);

    const newDocument = await prisma.document.create({
      data: {
        url: `/uploads/documents/${uniqueFilename}`,
        filename: file.name,
        title: file.name,
        fileSize: file.size,
        sectionId: sectionId,
      },
    });

    return NextResponse.json(newDocument, { status: 201 });

  } catch (error) {
    console.error('An unexpected error occurred in document upload API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}