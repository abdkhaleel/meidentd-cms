// src/app/api/images/upload/route.ts

import { NextRequest, NextResponse } from 'next/server'; // <-- Import NextRequest
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/prisma';

// No config object needed for App Router

export async function POST(request: NextRequest) { // <-- Use NextRequest instead of Request
  try {
    // 1. Get the FormData from the request
    const formData = await request.formData();

    // 2. Get the file and the associated sectionId from the form data
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

    // 3. Create the directory for uploads if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // This is fine if the directory already exists
    }

    // 4. Generate a unique filename to prevent overwrites
    const uniqueFilename = `${uuidv4()}${path.extname(file.name)}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    // 5. Save the file to the filesystem
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // 6. Create a record in the database
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